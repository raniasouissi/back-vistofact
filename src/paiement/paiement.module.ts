import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { Paiement, PaiementSchema } from './models/paiement.model';
import { Facture, FactureSchema } from 'src/facture/models/facture.model';
import { Echeance, EcheanceSchema } from 'src/echeance/models/echeance.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Paiement.name, schema: PaiementSchema },
    ]),
    MongooseModule.forFeature([{ name: Facture.name, schema: FactureSchema }]),
    MongooseModule.forFeature([
      { name: Echeance.name, schema: EcheanceSchema },
    ]),
  ],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}
