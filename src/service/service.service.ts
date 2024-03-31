import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './models/service.models';
import { CreateServiceDto } from './Dto/service.dto';
import { Client } from 'src/client/models/clients.models';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(Client.name)
    private clientModel: Model<Client>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // Vérifiez si le client avec l'identifiant spécifié existe
    const clientExists = await this.clientModel.exists({
      _id: createServiceDto.clientId,
    });

    if (!clientExists) {
      throw new NotFoundException('Client not found');
    }

    // Récupérez le client à partir de l'identifiant
    const client = await this.clientModel.findById(createServiceDto.clientId);

    // Créez une nouvelle instance de service avec les détails fournis dans le DTO de création
    const createdService = new this.serviceModel({
      ...createServiceDto,
      client: client, // Associez le client au service en utilisant l'instance de client récupérée
    });

    // Enregistrez le nouveau service dans la base de données
    return createdService.save();
  }

  async findAll(): Promise<Service[]> {
    // Utilisez la méthode find() pour récupérer tous les services
    // et utilisez populate pour inclure les données du client associé à chaque service
    return this.serviceModel.find().populate('client');
  }

  async findOne(id: string): Promise<Service> {
    // Utilisez findById() pour trouver un service par son ID
    // et utilisez populate pour inclure les données du client associé au service
    const service = await this.serviceModel.findById(id).populate('client');
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(
    id: string,
    updateServiceDto: CreateServiceDto,
  ): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Mettre à jour les champs du service avec les valeurs du DTO
    Object.assign(service, updateServiceDto);

    // Si un nouveau client ID est fourni dans le DTO, mettez à jour le client associé
    if (updateServiceDto.clientId) {
      // Vérifiez si le client existe
      const clientExists = await this.clientModel.exists({
        _id: updateServiceDto.clientId,
      });
      if (!clientExists) {
        throw new NotFoundException('Client not found');
      }

      // Récupérez le client à partir de l'ID et mettez à jour le service
      const client = await this.clientModel.findById(updateServiceDto.clientId);
      service.client = client;
    }

    return service.save();
  }

  async remove(id: string): Promise<void> {
    // Utilisez deleteOne() pour supprimer un service par son ID
    const result = await this.serviceModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Service not found');
    }
  }
}
