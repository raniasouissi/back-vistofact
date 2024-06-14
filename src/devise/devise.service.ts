import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Devise, DeviseDocument } from './models/devise.model';
import { CreateDeviseDto } from './Dto/devise.dto';
import { ActivatedDeviseDto } from './Dto/ActivatedDevise.dto';

@Injectable()
export class DeviseService {
  constructor(
    @InjectModel(Devise.name) private deviseModel: Model<DeviseDocument>,
  ) {}

  async createDevise(createDeviseDto: CreateDeviseDto): Promise<Devise> {
    const createdDevise = new this.deviseModel(createDeviseDto);
    return createdDevise.save();
  }

  async getAllDevises(): Promise<Devise[]> {
    return this.deviseModel.find().exec();
  }

  async getDeviseById(id: string): Promise<Devise> {
    const devise = await this.deviseModel.findById(id).exec();
    if (!devise) {
      throw new NotFoundException('Devise not found');
    }
    return devise;
  }

  async updateDevise(
    id: string,
    updateDeviseDto: CreateDeviseDto,
  ): Promise<Devise> {
    const devise = await this.deviseModel.findByIdAndUpdate(
      id,
      updateDeviseDto,
      {
        new: true,
      },
    );
    if (!devise) {
      throw new NotFoundException('Devise not found');
    }
    return devise;
  }

  async deleteDevise(id: string): Promise<void> {
    const devise = await this.deviseModel.findByIdAndDelete(id).exec();
    if (!devise) {
      throw new NotFoundException('Devise not found');
    }
  }

  async activatedDevises(
    id: string,
    activatedDevisesDto: ActivatedDeviseDto,
  ): Promise<Devise> {
    const devise = await this.deviseModel.findByIdAndUpdate(
      id,
      { status: activatedDevisesDto.status },
      { new: true },
    );
    if (!devise) {
      throw new NotFoundException(
        `La devise avec l'ID ${id} n'a pas été trouvée`,
      );
    }
    return devise;
  }
}
