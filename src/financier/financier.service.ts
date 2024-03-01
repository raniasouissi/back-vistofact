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

  async createFinancier(financierDto: FinancierDto): Promise<Financier> {
    const createdFinancier = new this.financierModel(financierDto);
    return createdFinancier.save();
  }

  async getAllFinanciers(): Promise<Financier[]> {
    return this.financierModel.find({ role: 'financier' }).exec();
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
    const updatedFinancier = await this.financierModel
      .findByIdAndUpdate(id, { $set: financierDto }, { new: true })
      .exec();

    if (!updatedFinancier) {
      throw new NotFoundException('Financier not found');
    }

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
}
