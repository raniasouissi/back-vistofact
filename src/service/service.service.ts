import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './models/service.model';
import { ServicesDto } from './Dto/service.dto';
import { Client } from '../client/models/clients.models';

@Injectable()
export class ServicesService {
  private sequenceNumbers: { [key: string]: number } = {};
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
  ) {}

  async create(createServiceDto: ServicesDto): Promise<Service> {
    // Vérifie si le client existe
    const clientExists = await this.clientModel.exists({
      _id: createServiceDto.clientId,
    });
    if (!clientExists) {
      throw new NotFoundException('Client not found');
    }

    // Récupère le client à partir de l'ID
    const client = await this.clientModel.findById(createServiceDto.clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const {
      reference,
      libelle,
      quantite,
      prix_unitaire,
      tvaId,
      montant_HT,
      montant_TTC,
      categoriesId,
      deviseId,
    } = createServiceDto;
    const newService = new this.serviceModel({
      reference,
      libelle,
      quantite,
      prix_unitaire,
      montant_TTC,
      montant_HT,
      client: client._id,
      tva: tvaId,
      categories: categoriesId,
      devise: deviseId,
    });

    // Enregistre le service dans la base de données
    return await newService.save();
  }

  async findAll(): Promise<ServicesDto[]> {
    const services = await this.serviceModel
      .find()
      .populate('client')
      .populate('tva')
      .populate('categories')
      .populate('devise')
      .exec();
    return services.map((service) => service.toObject());
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async delete(id: string): Promise<void> {
    const service = await this.serviceModel.findByIdAndDelete(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
  }
}
