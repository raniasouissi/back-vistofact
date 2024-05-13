// users.service.ts
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserDto } from './Dto/users.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/users.models';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

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

  async setPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({ resetToken: token }).exec();
      if (!user) {
        throw new NotFoundException('Token de réinitialisation invalide');
      }

      if (user.passwordUpdated) {
        throw new HttpException(
          {
            message:
              'Le mot de passe a déjà été modifié. Vous ne pouvez pas réinitialiser le mot de passe.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModel.updateOne(
        { _id: user._id },
        { password: hashedPassword, passwordUpdated: true },
      );

      await this.userModel.updateOne({ _id: user._id }, { resetToken: null });
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation du mot de passe :',
        error,
      );
      throw new HttpException(
        {
          message:
            'Une erreur est survenue lors de la réinitialisation du mot de passe.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
