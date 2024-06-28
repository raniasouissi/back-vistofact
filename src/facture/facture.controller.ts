import { Controller, Post, Body, Get } from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureDto } from './Dto/facture.dto';
import { Facture } from './models/facture.model';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('facture')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}
  @Post('fact')
  @ApiOperation({ summary: 'Créer une nouvelle facture' })
  @ApiResponse({
    status: 201,
    description: 'La facture a été créée avec succès.',
  })
  @ApiBody({ type: FactureDto })
  async create(@Body() factureDto: FactureDto): Promise<Facture> {
    console.log('Données reçues dans le contrôleur:', factureDto);

    return this.factureService.create(factureDto);
  }

  @Get()
  async findAll(): Promise<Facture[]> {
    return this.factureService.findAll();
  }
}
