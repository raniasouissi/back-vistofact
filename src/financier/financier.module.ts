// financier.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinancierController } from './financier.controller';
import { FinancierService } from './financier.service';
import { Financier, FinancierSchema } from './models/financier.models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Financier.name, schema: FinancierSchema },
    ]),
  ],
  controllers: [FinancierController],
  providers: [FinancierService],
})
export class FinancierModule {}
