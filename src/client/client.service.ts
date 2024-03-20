// clients.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './models/clients.models';
import { ClientDto } from './dto/clients.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
//import { Roles } from '../enum';
@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    private readonly mailerService: MailerService,
  ) {}

  private generateRandomPassword(length: number): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allCharacters = uppercase + lowercase + numbers + symbols;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let password = '';

    // Générer le mot de passe
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters.charAt(randomIndex);
    }

    // Assurer que le mot de passe généré respecte les critères
    if (!password.match(passwordRegex)) {
      // Régénérer le mot de passe si nécessaire
      return this.generateRandomPassword(length);
    }

    return password;
  }

  // Utilisation de la fonction de génération de mot de passe
  generatedPassword = this.generateRandomPassword(12); // Génère un mot de passe de longueur 12

  async signUpClient(
    signUpDto: ClientDto,
  ): Promise<{ message: string; result: any }> {
    const {
      name,
      email,
      roles,
      address,
      pays,
      phonenumber,
      codepostale,

      matriculeFiscale,
    } = signUpDto;

    try {
      const temporaryPassword = this.generateRandomPassword(12);

      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
      let userType = 'client physique';

      if (matriculeFiscale) {
        userType = 'client morale';
      }

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
      });

      await this.mailerService.sendMail({
        to: email,
        subject: 'Inscription réussie sur Visto Fact',
        html: `<p>Bienvenue ${name},</p>
                <p>Félicitations! Vous avez été inscrit avec succès sur Visto Fact. Voici vos informations d'inscription :</p>
                <ul>
                   
                    <li>Email: ${email}</li>
                    <li>Mot de passe : ${temporaryPassword}</li>
                </ul>
                <p>Connectez-vous avec votre email et le mot de passe . Vous serez invité à le changer après la première connexion.</p>
                <p>L'équipe Visto Fact vous souhaite la bienvenue!</p>`,
      });

      return {
        message:
          'Inscription réussie. Un e-mail a été envoyé avec les informations.',
        result: user,
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw new Error("Une erreur est survenue lors de l'inscription.");
    }
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
          ],
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
