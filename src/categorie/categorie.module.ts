import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorieController } from './categorie.controller';
import { CategorieService } from './categorie.service';
import { Categorie, CategorieSchema } from './models/categorie.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categorie.name, schema: CategorieSchema },
    ]),
  ],
  controllers: [CategorieController],
  providers: [CategorieService],
})
export class CategorieModule {}
