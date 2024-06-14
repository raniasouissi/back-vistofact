import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EcheanceService } from './echeance.service';
import { EcheanceController } from './echeance.controller';
import { Echeance, EcheanceSchema } from './models/echeance.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Echeance.name, schema: EcheanceSchema },
    ]),
  ],
  providers: [EcheanceService],
  controllers: [EcheanceController],
})
export class EcheanceModule {}
