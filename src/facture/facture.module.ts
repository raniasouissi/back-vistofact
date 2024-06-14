import { Client, ClientSchema } from './../client/models/clients.models';
import { Service, ServiceSchema } from './../service/models/service.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { Facture, FactureSchema } from './models/facture.model';

import { ServicesService } from 'src/service/service.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Facture.name, schema: FactureSchema }]),
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  providers: [FactureService, ServicesService],
  controllers: [FactureController],
})
export class FactureModule {}
