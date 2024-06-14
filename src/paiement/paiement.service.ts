import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paiement, PaiementDocument } from 'src/paiement/models/paiement.model';

import { PaiementDto } from 'src/paiement/Dto/paiement.dto';
import { Echeance, EcheanceDocument } from 'src/echeance/models/echeance.model';
import { EcheanceDto } from 'src/echeance/Dto/echenace.dto';

@Injectable()
export class PaiementService {
  constructor(
    @InjectModel(Paiement.name) private paiementModel: Model<PaiementDocument>,
    @InjectModel(Echeance.name) private echeanceModel: Model<EcheanceDocument>,
  ) {}

  async create(paiementDto: PaiementDto): Promise<Paiement> {
    const { etatpaiement, montantPaye, typepaiement, datepaiement, factures } =
      paiementDto;
    let echeances: Echeance[] = [];

    // Si le type de paiement est "cheque", enregistrer les échéances
    if (typepaiement === 'cheque' && paiementDto.echeances) {
      echeances = await Promise.all(
        paiementDto.echeances.map(async (echeanceDto: EcheanceDto) => {
          const { numCheque, montantCheque, dateEcheance } = echeanceDto;
          const createdEcheance = new this.echeanceModel({
            numCheque,
            montantCheque,
            dateEcheance,
          });
          return createdEcheance.save();
        }),
      );
    }

    // Créer une nouvelle instance de paiement
    const createdPaiement = new this.paiementModel({
      factures,
      etatpaiement,
      montantPaye,
      typepaiement,
      datepaiement,
      echeances, // Assigner les échéances créées au paiement
    });

    // Enregistrer le paiement dans la base de données
    const savedPaiement = await createdPaiement.save();

    return savedPaiement;
  }
}
