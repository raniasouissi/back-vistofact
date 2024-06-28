import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './models/facture.model';
import { FactureDto } from './Dto/facture.dto';
import { Service } from 'src/service/models/service.model';
import { ServicesDto } from 'src/service/Dto/service.dto';
import { Client } from 'src/client/models/clients.models';

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
}
