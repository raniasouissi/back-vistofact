// service.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './service.controller';
import { ServicesService } from './service.service';
import { Service, ServiceSchema } from './models/service.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServiceModule {}
