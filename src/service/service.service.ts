import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './models/service.model';
import { ServicesDto } from './Dto/service.dto';

@Injectable()
export class ServicesService {
  private sequenceNumbers: { [key: string]: number } = {};
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(createServiceDto: ServicesDto): Promise<Service> {
    const {
      reference,
      libelle,

      prix_unitaire,

      categoriesId,
      deviseId,
    } = createServiceDto;
    const newService = new this.serviceModel({
      reference,
      libelle,

      prix_unitaire,

      categories: categoriesId,
      devise: deviseId,
    });

    // Enregistre le service dans la base de données
    return await newService.save();
  }

  async findAll(): Promise<ServicesDto[]> {
    const services = await this.serviceModel
      .find()
      .populate('categories')
      .populate('devise')
      .populate('tva')
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

  async update(id: string, updateServiceDto: ServicesDto): Promise<Service> {
    const { categoriesId, deviseId, ...serviceData } = updateServiceDto;

    const service = await this.serviceModel.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    service.set({
      ...serviceData,

      categories: categoriesId,
      devise: deviseId,
    });

    return await service.save();
  }

  async delete(id: string): Promise<void> {
    const service = await this.serviceModel.findByIdAndDelete(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
  }
  async searchServices(query: string): Promise<Service[]> {
    try {
      if (!query) {
        return null; // Ou renvoyez une liste vide selon votre logique
      }
      const services = await this.serviceModel
        .find({
          $or: [
            { reference: { $regex: query, $options: 'i' } },
            { libelle: { $regex: query, $options: 'i' } },
          ],
        })
        .exec();
      return services;
    } catch (error) {
      console.error('Erreur lors de la recherche des services :', error);
      throw new Error(
        'Une erreur est survenue lors de la recherche des services.',
      );
    }
  }

  //pour facutre
  async updateService(
    id: string,
    updateServiceDto: Partial<ServicesDto>,
  ): Promise<Service> {
    const service = await this.serviceModel.findById(id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    Object.assign(service, updateServiceDto);

    return await service.save();
  }
}
