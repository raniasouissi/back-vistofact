// clients.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsController } from './clients.controller';
import { ClientsService } from './client.service';
import { Client, ClientSchema } from './models/clients.models';
import { User, UserSchema } from 'src/users/models/users.models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
