import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureDto } from './Dto/facture.dto';
import { Facture } from './models/facture.model';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFactureDto } from './Dto/update.dto';

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

  @Put(':id')
  async updateFacture(
    @Param('id') id: string,
    @Body() updateFactureDto: UpdateFactureDto,
  ): Promise<Facture> {
    const updatedFacture = await this.factureService.updateFacture(
      id,
      updateFactureDto,
    );
    if (!updatedFacture) {
      throw new NotFoundException(`La facture avec l'ID '${id}' n'existe pas.`);
    }
    return updatedFacture;
  }

  @Get()
  async findAll(): Promise<Facture[]> {
    return this.factureService.findAll();
  }
}
