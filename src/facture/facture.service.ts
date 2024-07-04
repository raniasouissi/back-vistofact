import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './models/facture.model';
import { FactureDto } from './Dto/facture.dto';
import { Service } from 'src/service/models/service.model';
import { ServicesDto } from 'src/service/Dto/service.dto';
import { Client } from 'src/client/models/clients.models';
import * as moment from 'moment';

@Injectable()
export class FactureService {
  constructor(
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Client.name) private readonly clientModel: Model<Client>, // Injectez le modèle de client
  ) {}
  async create(factureDto: FactureDto): Promise<Facture> {
    console.log('Données reçues dans le service:', factureDto);
    const serviceDtos: ServicesDto[] = factureDto.services;
    const numeroFacture = await Facture.generateNumeroFacture(
      this.factureModel,
    );

    const savedServices = await Promise.all(
      serviceDtos.map(async (serviceDto) => {
        const {
          reference,
          libelle,
          unite,
          prix_unitaire,
          quantite,
          montant_ht,
          remise,
          tva,
        } = serviceDto;
        const createdService = new this.serviceModel({
          reference,
          libelle,
          unite,
          prix_unitaire,
          montant_ht,
          quantite,
          remise,
          tva,
        });
        return createdService.save();
      }),
    );

    const serviceIds = savedServices.map((service) => service._id);

    const { deviseid, timbreid, clientid, parametrageid, ...factureData } =
      factureDto;

    const createdFacture = new this.factureModel({
      ...factureData,
      devise: deviseid,
      services: serviceIds,
      timbre: timbreid,
      client: clientid,
      parametrage: parametrageid,
      numeroFacture,
    });

    const savedFacture = await createdFacture.save(); // Enregistrer la facture et récupérer l'instance enregistrée

    // Mettre à jour la liste des factures du client
    const client = await this.clientModel.findById(clientid);
    client.factures.push(savedFacture._id); // Ajouter l'ID de la nouvelle facture à la liste des factures du client
    await client.save();

    return savedFacture;
  }

  async findAll(): Promise<Facture[]> {
    return this.factureModel
      .find()
      .populate('devise')
      .populate({
        path: 'services',
        populate: [{ path: 'categories' }, { path: 'devise' }, { path: 'tva' }],
      })
      .populate('timbre')
      .populate('client')
      .populate('parametrage')
      .populate({
        path: 'paiemnts', // Assurez-vous d'utiliser le bon chemin défini dans votre schéma
        populate: {
          path: 'echeances',
          model: 'Echeance', // Assurez-vous que 'Echeance' correspond au modèle de votre échéance
        },
      })
      .exec();
  }

  async searchFactures(query?: string): Promise<Facture[]> {
    try {
      const searchCriteria: any = {};

      // Construire le critère de recherche basé sur le numéro de facture
      if (query) {
        searchCriteria.$or = [
          { numeroFacture: { $regex: query, $options: 'i' } },
        ];
      }

      // Ajouter la recherche par nom de client
      if (query) {
        searchCriteria.$or.push({
          'client.name': { $regex: query, $options: 'i' },
        });
      }

      // Ajouter la recherche par nom d'entreprise dans parametrage
      if (query) {
        searchCriteria.$or.push({
          'parametrage.nomEntreprise': { $regex: query, $options: 'i' },
        });
      }

      // Ajouter la recherche par date si la chaîne est une date valide avec moment
      if (query && moment(query, moment.ISO_8601, true).isValid()) {
        const date = moment(query).toDate(); // Convertir en objet Date

        searchCriteria.date = { $eq: date }; // Utiliser $eq pour une correspondance exacte de la date
      }

      // Log pour vérifier le critère de recherche appliqué
      console.log(
        'Critère de recherche :',
        JSON.stringify(searchCriteria, null, 2),
      );

      const factures = await this.factureModel
        .find(searchCriteria)
        .populate('devise')
        .populate('services')
        .populate('timbre')
        .populate('client')
        .populate('parametrage')
        .populate({
          path: 'paiemnts',
          populate: {
            path: 'echeances',
            model: 'Echeance',
          },
        })
        .exec();

      // Log pour vérifier les résultats trouvés
      console.log('Résultats trouvés :', factures);

      return factures;
    } catch (error) {
      console.error('Erreur lors de la recherche des factures :', error);
      throw new Error(
        'Une erreur est survenue lors de la recherche des factures.',
      );
    }
  }
}
