// parametrage.module.ts
import { Module } from '@nestjs/common';
import { ParametrageService } from './parametrage.service';
import { ParametrageController } from './parametrage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parametrage, ParametrageSchema } from './models/parametrage.model';
import { Tva, TvaSchema } from 'src/tva/models/tva.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parametrage.name, schema: ParametrageSchema },
      { name: Tva.name, schema: TvaSchema },
    ]),
  ],
  providers: [ParametrageService],
  controllers: [ParametrageController],
})
export class ParametrageModule {}
