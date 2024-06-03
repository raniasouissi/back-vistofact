import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsController } from './clients.controller';
import { ClientsService } from './client.service';
import { Client, ClientSchema } from './models/clients.models';
import { User, UserSchema } from 'src/users/models/users.models';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
//import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: User.name, schema: UserSchema },
    ]),

    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Dossier où les images téléchargées seront stockées
        filename: (req, file, callback) => {
          const originalExt = extname(file.originalname);
          const uniqueFilename = `${uuidv4()}${originalExt}`;
          callback(null, uniqueFilename);
        },
      }),
    }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
