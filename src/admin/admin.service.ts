import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './models/admin.models';
import { AdminDto } from './Dto/admin.dto';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async getAllAdmins(): Promise<Admin[]> {
    return await this.adminModel.find({ role: 'admin' }).exec();
  }

  async createAdmin(body: AdminDto) {
    return this.adminModel.create(body);
  }

  findOne(id: string) {
    return this.adminModel.findOne({ _id: id });
  }

  async updateAdmin(id: string, body: AdminDto): Promise<string> {
    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, { $set: body }, { new: true })
      .exec();

    if (!updatedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    return 'Admin has been updated successfully';
  }

  async deleteAdmin(id: string): Promise<string> {
    const deletedAdmin = await this.adminModel.findByIdAndDelete(id).exec();

    if (!deletedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    return 'Admin has been deleted successfully';
  }
}
