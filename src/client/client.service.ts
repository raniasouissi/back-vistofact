// clients.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './models/clients.models';
import { ClientDto } from './dto/clients.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/models/users.models';
import { ActivatedClientDto } from './Dto/ActivatedClient.dto';
import * as moment from 'moment'; // Importer moment pour manipuler les dates
import { Cron, CronExpression } from '@nestjs/schedule'; // Importer Cron pour la planification des tâches

//import { Roles } from '../enum';
@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(User.name)
    private userModel: Model<User>,

    private readonly mailerService: MailerService,
  ) {}

  async signUpClient(
    signUpDto: ClientDto,
    image: string,
  ): Promise<{ message: string; result: any }> {
    const {
      name,
      email,
      address,
      pays,
      roles,
      phonenumber,
      codepostale,
      matriculeFiscale,
      namecompany,
      status,
    } = signUpDto;

    try {
      let userType = 'client physique';
      if (matriculeFiscale) {
        userType = 'client morale';
      }

      const randomNumber = Math.floor(Math.random() * 9000) + 1000;
      const reference =
        namecompany.substring(0, 3).toUpperCase() + randomNumber.toString();
      const temporaryPassword = randomBytes(8).toString('hex');
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
      const token = randomBytes(32).toString('hex');

      const userData = {
        name,
        email,
        password: hashedPassword,
        roles,
        address,
        pays,
        phonenumber,
        codepostale,
        type: userType,
        matriculeFiscale,
        namecompany,
        reference,
        resetToken: token,
        image,
        status,
        isVerified: true,
      };

      const user = await this.clientModel.create(userData);

      await this.sendSetPasswordEmail(email, token, name);

      return {
        message:
          'Inscription réussie. Un e-mail a été envoyé avec les instructions.',
        result: user,
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw new Error("Une erreur est survenue lors de l'inscription.");
    }
  }

  async sendSetPasswordEmail(
    email: string,
    token: string,
    name: string,
  ): Promise<void> {
    const setPasswordLink = `http://localhost:3000/set-password/${token}`;

    // Envoyer un e-mail au client avec le lien pour définir le mot de passe
    await this.mailerService.sendMail({
      to: email,
      subject: 'Définition du mot de passe',
      html: `
        <p>Bonjour ${name},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe sur Visto Fact.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour définir votre nouveau mot de passe :</p>
        <p><a href="${setPasswordLink}">Définir le mot de passe</a></p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        <p>Cordialement,<br/>L'équipe Visto Fact</p>
      `,
    });
  }

  async getAllClients(): Promise<Client[]> {
    try {
      return await this.clientModel
        .find({ roles: 'client' })
        .populate('factures')
        .exec();
    } catch (error) {
      // Gérer les erreurs ici
      console.error(
        'Erreur lors de la récupération des clients avec les factures peuplées :',
        error,
      );
      throw error;
    }
  }

  async FindOne(id: string): Promise<Client> {
    try {
      return await this.clientModel
        .findOne({ _id: id })
        .populate({
          path: 'factures',
          populate: [
            { path: 'services', populate: { path: 'tva' } },
            { path: 'timbre' },
            { path: 'devise' },
            { path: 'parametrage' },
            { path: 'client' },
            { path: 'paiemnts', populate: { path: 'echeances' } },
          ],
        })
        .exec();
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du client avec les factures et les relations peuplées :',
        error,
      );
      throw error;
    }
  }

  async updateClient(
    id: string,
    body: ClientDto,
    image: string,
  ): Promise<string> {
    const client = await this.clientModel.findById(id).exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Mettre à jour tous les champs du client avec les valeurs du corps de la requête
    Object.assign(client, body);

    // Mettre à jour l'image si elle est fournie
    if (image) {
      // Vous pouvez traiter l'image de la même manière que dans la méthode signUpClient
      // Assurez-vous de stocker l'image correctement et de gérer les erreurs si nécessaire
      client.image = image;
    }

    await client.save();

    return 'Client has been updated successfully';
  }

  async deleteClient(id: string): Promise<string> {
    const deletedClient = await this.clientModel.findByIdAndDelete(id).exec();
    if (!deletedClient) {
      throw new NotFoundException('Client not found');
    }

    return 'Client has been deleted successfully';
  }
  async searchClients(query: string): Promise<Client[] | null> {
    try {
      if (!query) {
        return null; // ou renvoyez une liste vide selon votre logique
      }
      const clients = await this.clientModel
        .find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { phonenumber: { $regex: query, $options: 'i' } },
            { pays: { $regex: query, $options: 'i' } },
            { matriculeFiscale: { $regex: query, $options: 'i' } },
          ],
          roles: 'client',
        })
        .exec();

      return clients;
    } catch (error) {
      console.error('Erreur lors de la recherche des clients :', error);
      throw new Error(
        'Une erreur est survenue lors de la recherche des clients.',
      );
    }
  }

  async activatedClients(
    id: string,
    activatedClientDto: ActivatedClientDto,
  ): Promise<Client> {
    const client = await this.clientModel.findByIdAndUpdate(
      id,
      { status: activatedClientDto.status },
      { new: true },
    );
    if (!client) {
      throw new NotFoundException(
        `Le client avec l'ID ${id} n'a pas été trouvée`,
      );
    }
    return client;
  }
  @Cron(CronExpression.EVERY_WEEK)
  async deleteUnverifiedClientsAfterSevenDays(): Promise<void> {
    try {
      const sevenDaysAgo = moment().subtract(7, 'days').toDate();
      const result = await this.clientModel
        .deleteMany({
          isVerified: false,
          createdAt: { $lte: sevenDaysAgo },
          roles: 'client',
        })
        .exec();

      console.log(`${result.deletedCount} clients non vérifiés supprimés.`);
    } catch (error) {
      console.error(
        'Erreur lors de la suppression des clients non vérifiés :',
        error,
      );
      throw new Error(
        'Une erreur est survenue lors de la suppression des clients non vérifiés.',
      );
    }
  }
}
