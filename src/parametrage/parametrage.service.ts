import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parametrage, ParametrageDocument } from './models/parametrage.model';
import { ParametrageDto } from './Dto/parametrage.dto';

@Injectable()
export class ParametrageService {
  constructor(
    @InjectModel(Parametrage.name)
    private parametrageModel: Model<ParametrageDocument>,
  ) {}

  async create(parametrageDto: ParametrageDto): Promise<Parametrage> {
    const createdParametrage = new this.parametrageModel(parametrageDto);
    return createdParametrage.save();
  }

  async findAll(): Promise<Parametrage[]> {
    return this.parametrageModel.find().exec();
  }

  async findOne(id: string): Promise<Parametrage> {
    const parametrage = await this.parametrageModel.findById(id).exec();
    if (!parametrage) {
      throw new NotFoundException('Parametrage not found');
    }
    return parametrage;
  }

  async updateParametrage(
    id: string,
    parametrageDto: ParametrageDto,
  ): Promise<string> {
    const parametrage = await this.parametrageModel.findById(id).exec();
    if (!parametrage) {
      throw new NotFoundException('Parametrage not found');
    }

    // Mettre à jour tous les champs du parametrage avec les valeurs du corps de la requête
    Object.assign(parametrage, parametrageDto);

    await parametrage.save();

    return 'Parametrage has been updated successfully';
  }

  async delete(id: string): Promise<Parametrage> {
    const deletedParametrage = await this.parametrageModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedParametrage) {
      throw new NotFoundException('Parametrage not found');
    }
    return deletedParametrage;
  }
}
