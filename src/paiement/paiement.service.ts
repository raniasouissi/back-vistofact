import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paiement, PaiementDocument } from 'src/paiement/models/paiement.model';

import { PaiementDto } from 'src/paiement/Dto/paiement.dto';
import { Echeance, EcheanceDocument } from 'src/echeance/models/echeance.model';
import { EcheanceDto } from 'src/echeance/Dto/echenace.dto';
import { Facture, FactureDocument } from 'src/facture/models/facture.model';

@Injectable()
export class PaiementService {
  constructor(
    @InjectModel(Paiement.name) private paiementModel: Model<PaiementDocument>,
    @InjectModel(Echeance.name) private echeanceModel: Model<EcheanceDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
  ) {}

  async create(paiementDto: PaiementDto): Promise<Paiement> {
    const { etatpaiement, montantPaye, typepaiement, datepaiement, factures } =
      paiementDto;
    let echeances: Echeance[] = [];

    if (typepaiement === 'cheque') {
      // Si le paiement est "payé", créer une seule échéance
      if (etatpaiement === 'Payé') {
        const { numCheque, montantCheque, dateCh } = paiementDto.echeances[0]; // Supposons qu'il y ait une seule échéance pour un paiement payé
        const createdEcheance = new this.echeanceModel({
          numCheque,
          montantCheque,
          dateCh,
        });
        echeances.push(await createdEcheance.save());
      }

      // Si le paiement est "partiellement payé", créer plusieurs échéances
      if (etatpaiement === 'partiellementPayé') {
        echeances = await Promise.all(
          paiementDto.echeances.map(async (echeanceDto: EcheanceDto) => {
            const { numCheque, montantCheque, dateCh } = echeanceDto;
            const createdEcheance = new this.echeanceModel({
              numCheque,
              montantCheque,
              dateCh,
            });
            return createdEcheance.save();
          }),
        );
      }
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
    const facture = await this.factureModel.findById(factures).exec();
    if (!facture) {
      throw new NotFoundException('Facture non trouvée');
    }
    facture.paiemnts.push(savedPaiement._id);
    await facture.save();
    return savedPaiement;
  }

  async getAll(): Promise<Paiement[]> {
    try {
      const paiements = await this.paiementModel.find().exec();
      return paiements;
    } catch (error) {
      // Gérer les erreurs ici, par exemple en lançant une exception NotFoundException si aucun paiement n'est trouvé
      throw new NotFoundException('Aucun paiement trouvé');
    }
  }
}
