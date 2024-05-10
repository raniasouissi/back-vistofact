// service.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './service.controller';
import { ServicesService } from './service.service';
import { Service, ServiceSchema } from './models/service.model';
import { Client, ClientSchema } from 'src/client/models/clients.models';
import { Tva, TvaSchema } from 'src/tva/models/tva.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Tva.name, schema: TvaSchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServiceModule {}
