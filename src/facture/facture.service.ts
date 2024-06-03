import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './models/facture.model';
import { FactureDto } from './Dto/facture.dto';
import { Service } from 'src/service/models/service.model';
import { ServicesDto } from 'src/service/Dto/service.dto';

@Injectable()
export class FactureService {
  constructor(
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
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
          prix_unitaire,
          quantite,
          montant_ht,
          remise,
        } = serviceDto;
        const createdService = new this.serviceModel({
          reference,
          libelle,
          prix_unitaire,
          montant_ht,
          quantite,
          remise,
        });
        return createdService.save();
      }),
    );
    console.log(savedServices);

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

    return createdFacture.save();
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
