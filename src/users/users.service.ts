// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './Dto/users.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/users.models';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  Add(body: UserDto) {
    return this.userModel.create(body);
  }

  FindAll(key: string) {
    const keyword = key
      ? {
          $or: [
            { fullname: { $regex: key, $options: 'i' } },
            { email: { $regex: key, $options: 'i' } },
          ],
        }
      : {};
    return this.userModel.find(keyword);
  }

  FindOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  async updateUser(id: string, body: UserDto): Promise<string> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: body }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return 'User has been updated successfully';
  }

  async deleteUser(id: string): Promise<string> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return 'User has been deleted successfully';
  }
}
