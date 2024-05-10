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
    } = signUpDto;

    try {
      let userType = 'client physique';
      if (matriculeFiscale) {
        userType = 'client morale';
      }

      const randomNumber = Math.floor(Math.random() * 9000) + 1000;

      // Générer la référence en concaténant les trois premières lettres du nom de la société avec le nombre aléatoire
      const reference =
        namecompany.substring(0, 3).toUpperCase() + randomNumber.toString();

      // Générer un mot de passe temporaire
      const temporaryPassword = randomBytes(8).toString('hex');

      // Hacher le mot de passe temporaire
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Générer un token pour le lien de réinitialisation du mot de passe
      const token = randomBytes(32).toString('hex');

      // Créer le client avec le mot de passe temporaire, la référence et le token de réinitialisation
      const user = await this.clientModel.create({
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
      });

      // Envoyer un e-mail au client avec le lien pour définir le mot de passe
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
    return await this.clientModel.find({ roles: 'client' }).exec();
  }

  FindOne(id: string) {
    return this.clientModel.findOne({ _id: id });
  }

  async updateClient(id: string, body: ClientDto): Promise<string> {
    const client = await this.clientModel.findById(id).exec();

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Mettre à jour tous les champs du client avec les valeurs du corps de la requête
    Object.assign(client, body);

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
}
