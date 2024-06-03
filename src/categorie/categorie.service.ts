import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categorie, CategorieDocument } from './models/categorie.model';
import { CreateCategorieDto, UpdateCategorieDto } from './dto/categorie.dto';

@Injectable()
export class CategorieService {
  constructor(
    @InjectModel(Categorie.name)
    private categorieModel: Model<CategorieDocument>,
  ) {}

  async createCategorie(
    createCategorieDto: CreateCategorieDto,
  ): Promise<Categorie> {
    const createdCategorie = new this.categorieModel(createCategorieDto);
    return createdCategorie.save();
  }

  async getAllCategories(): Promise<Categorie[]> {
    return this.categorieModel.find().exec();
  }

  async getCategorieById(id: string): Promise<Categorie> {
    return this.categorieModel.findById(id).exec();
  }

  async updateCategorie(
    id: string,
    updateCategorieDto: UpdateCategorieDto,
  ): Promise<Categorie> {
    return this.categorieModel
      .findByIdAndUpdate(id, updateCategorieDto, { new: true })
      .exec();
  }

  async deleteCategorie(id: string): Promise<void> {
    await this.categorieModel.findByIdAndDelete(id).exec();
  }

  async searchCategories(query: string): Promise<Categorie[]> {
    try {
      if (!query) {
        return null; // Ou renvoyez une liste vide selon votre logique
      }
      const categories = await this.categorieModel
        .find({
          $or: [
            { titre: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
          ],
        })
        .exec();
      return categories;
    } catch (error) {
      console.error('Erreur lors de la recherche des catégories :', error);
      throw new Error(
        'Une erreur est survenue lors de la recherche des catégories.',
      );
    }
  }
}
