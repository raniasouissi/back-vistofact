// tva.service.ts

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tva, TvaDocument } from './models/tva.model';
import { UpdateTvaDto } from './dto/tva.dto';

@Injectable()
export class TvaService {
  constructor(
    @InjectModel(Tva.name) private readonly tvaModel: Model<TvaDocument>,
  ) {}

  async createTva(createTvaDto: UpdateTvaDto): Promise<Tva> {
    try {
      const { title, rate } = createTvaDto;

      // Vérifier si une TVA avec la même valeur existe déjà
      const existingTva = await this.tvaModel.findOne({ rate }).exec();
      if (existingTva) {
        throw new ConflictException('Une TVA avec cette valeur existe déjà.');
      }

      // Créer une nouvelle instance de Tva avec les valeurs formatées
      const createdTva = new this.tvaModel({ title, rate });

      // Sauvegarder et retourner le résultat
      return await createdTva.save();
    } catch (error) {
      throw new Error('Échec de la création de la TVA');
    }
  }

  async getAllTva(): Promise<Tva[]> {
    try {
      return await this.tvaModel.find().exec();
    } catch (error) {
      throw new Error('Échec de récupération de toutes les TVA');
    }
  }

  async getTvaById(id: string): Promise<Tva> {
    try {
      const tva = await this.tvaModel.findById(id).exec();
      if (!tva) {
        throw new NotFoundException('TVA non trouvée');
      }
      return tva;
    } catch (error) {
      throw new Error('Échec de récupération de la TVA par ID');
    }
  }

  async updateTva(id: string, updateTvaDto: UpdateTvaDto): Promise<Tva> {
    try {
      const updatedTva = await this.tvaModel
        .findByIdAndUpdate(id, updateTvaDto, { new: true })
        .exec();
      if (!updatedTva) {
        throw new NotFoundException('TVA non trouvée');
      }
      return updatedTva;
    } catch (error) {
      throw new Error('Échec de la mise à jour de la TVA');
    }
  }

  async deleteTva(id: string): Promise<void> {
    try {
      const deletedTva = await this.tvaModel.findByIdAndDelete(id).exec();
      if (!deletedTva) {
        throw new NotFoundException('TVA non trouvée');
      }
    } catch (error) {
      throw new Error('Échec de la suppression de la TVA');
    }
  }
}
