// financier.controller.ts

import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FinancierService } from './financier.service'; // Assurez-vous que le nom du service est correct
import { Financier } from './models/financier.models';
import { FinancierDto } from './Dto/financier.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('financiers')
export class FinancierController {
  constructor(private financierService: FinancierService) {}

  @Get()
  async findAll(): Promise<Financier[]> {
    return this.financierService.getAllFinanciers();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.financierService.findOne(id);
  }
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: FinancierDto })
  @Put('/:id')
  async update(@Param('id') id: string, @Body() financierDto: FinancierDto) {
    return this.financierService.updateFinancier(id, financierDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.financierService.deleteFinancier(id);
  }
  @Get('search/:query')
  async searchFinanciers(
    @Param('query') query: string,
  ): Promise<Financier[] | null> {
    try {
      if (!query) {
        return null; // Ou renvoyez une liste vide selon votre logique
      }
      return this.financierService.searchFinanciers(query);
    } catch (error) {
      console.error('Erreur lors de la recherche des financiers :', error);
      throw new Error(
        'Une erreur est survenue lors de la recherche des financiers.',
      );
    }
  }
}
