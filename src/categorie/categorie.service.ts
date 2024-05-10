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
}
