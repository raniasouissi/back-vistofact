// tva.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tva, TvaSchema } from './models/tva.model';
import { TvaController } from './tva.controller';
import { TvaService } from './tva.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tva.name, schema: TvaSchema }])],
  controllers: [TvaController],
  providers: [TvaService],
})
export class TvaModule {}
