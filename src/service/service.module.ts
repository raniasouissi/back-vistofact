// service.module.ts

import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './models/service.models';
import { Client, ClientSchema } from 'src/client/models/clients.models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
