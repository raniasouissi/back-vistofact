import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './models/facture.model';
import { FactureDto } from './Dto/facture.dto';
import { Service } from 'src/service/models/service.model';
import { ServicesDto } from 'src/service/Dto/service.dto';
import { Client } from 'src/client/models/clients.models';
import { UpdateFactureDto } from './Dto/update.dto';
import { differenceInDays } from 'date-fns';

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

    const Date_Fact = new Date();
    const delaiP = differenceInDays(
      new Date(factureDto.dateEcheance),
      Date_Fact,
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
      delai: delaiP,
    });

    const savedFacture = await createdFacture.save(); // Enregistrer la facture et récupérer l'instance enregistrée

    // Mettre à jour la liste des factures du client
    const client = await this.clientModel.findById(clientid);
    client.factures.push(savedFacture._id); // Ajouter l'ID de la nouvelle facture à la liste des factures du client
    await client.save();

    return savedFacture;
  }

  async updateFacture(
    id: string,
    updateFactureDto: UpdateFactureDto,
  ): Promise<Facture> {
    const existingFacture = await this.factureModel.findByIdAndUpdate(
      id,
      updateFactureDto,
      { new: true },
    );
    if (!existingFacture) {
      throw new NotFoundException(`La facture avec l'ID '${id}' n'existe pas.`);
    }
    return existingFacture;
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
      .exec();
  }
}
