import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Devise, DeviseSchema } from './models/devise.model';
import { DeviseService } from './devise.service';
import { DeviseController } from './devise.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Devise.name, schema: DeviseSchema }]),
  ],
  providers: [DeviseService],
  controllers: [DeviseController],
})
export class DeviseModule {}
