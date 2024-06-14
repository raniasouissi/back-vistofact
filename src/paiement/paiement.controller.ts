import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementDto } from './dto/paiement.dto';
import { Paiement } from './models/paiement.model';

@Controller('paiements')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Post()
  async create(@Body() paiementDto: PaiementDto): Promise<Paiement> {
    try {
      return await this.paiementService.create(paiementDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
