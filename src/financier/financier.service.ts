// financier.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { FinancierDto } from './Dto/financier.dto';
import { Financier, FinancierDocument } from './models/financier.models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FinancierService {
  constructor(
    @InjectModel(Financier.name)
    private financierModel: Model<FinancierDocument>,
  ) {}

  async getAllFinanciers(): Promise<Financier[]> {
    return this.financierModel.find({ roles: 'financier' }).exec();
  }

  async findOne(id: string): Promise<Financier> {
    const financier = await this.financierModel.findById(id).exec();
    if (!financier) {
      throw new NotFoundException('Financier not found');
    }
    return financier;
  }

  async updateFinancier(
    id: string,
    financierDto: FinancierDto,
  ): Promise<Financier> {
    const existingFinancier = await this.financierModel.findById(id).exec();

    if (!existingFinancier) {
      throw new NotFoundException('Financier not found');
    }

    // Mettre à jour les champs du modèle avec les valeurs du DTO
    Object.assign(existingFinancier, financierDto);

    // Sauvegarder le modèle mis à jour
    const updatedFinancier = await existingFinancier.save();
    return updatedFinancier;
  }

  async deleteFinancier(id: string): Promise<string> {
    const deletedFinancier = await this.financierModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedFinancier) {
      throw new NotFoundException('Financier not found');
    }

    return 'Financier has been deleted successfully';
  }
  async searchFinanciers(query: string): Promise<Financier[] | null> {
    try {
      if (!query) {
        return null; // ou renvoyez une liste vide selon votre logique
      }
      const financiers = await this.financierModel
        .find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        })
        .exec();

      return financiers;
    } catch (error) {
      console.error('Erreur lors de la recherche des financiers :', error);
      throw new Error(
        'Une erreur est survenue lors de la recherche des financiers.',
      );
    }
  }
}
