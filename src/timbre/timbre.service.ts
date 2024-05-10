import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timbre, TimbreDocument } from './models/timbre.model';
import { CreateTimbreDto, UpdateTimbreDto } from './dto/timbre.dto';

@Injectable()
export class TimbreService {
  constructor(
    @InjectModel(Timbre.name) private timbreModel: Model<TimbreDocument>,
  ) {}

  async createTimbre(createTimbreDto: CreateTimbreDto): Promise<Timbre> {
    const createdTimbre = new this.timbreModel(createTimbreDto);
    return createdTimbre.save();
  }

  async getAllTimbres(): Promise<Timbre[]> {
    return this.timbreModel.find().exec();
  }

  async getTimbreById(id: string): Promise<Timbre> {
    const timbre = await this.timbreModel.findById(id).exec();
    if (!timbre) {
      throw new NotFoundException('Timbre not found');
    }
    return timbre;
  }

  async updateTimbre(id: string, timbreDto: UpdateTimbreDto): Promise<Timbre> {
    const timbre = await this.timbreModel.findByIdAndUpdate(id, timbreDto, {
      new: true,
    });
    if (!timbre) {
      throw new NotFoundException('Timbre not found');
    }
    return timbre;
  }

  async deleteTimbre(id: string): Promise<void> {
    const timbre = await this.timbreModel.findByIdAndDelete(id).exec();
    if (!timbre) {
      throw new NotFoundException('Timbre not found');
    }
  }
}
