// tva.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { TvaService } from './tva.service';
import { UpdateTvaDto } from './Dto/tva.dto';
import { Tva } from './models/tva.model';
import { ActivatedTvaDto } from './Dto/ActivatedTva.dto';

@Controller('tva')
export class TvaController {
  constructor(private readonly tvaService: TvaService) {}

  @Post()
  async createTva(@Body() createTvaDto: UpdateTvaDto): Promise<any> {
    try {
      const createdTva = await this.tvaService.createTva(createTvaDto);
      return createdTva;
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        throw new HttpException(
          'Une TVA avec cette valeur existe déjà.',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          'Échec de la création de la TVA',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get()
  async getAllTva(): Promise<Tva[]> {
    try {
      return await this.tvaService.getAllTva();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getTvaById(@Param('id') id: string): Promise<Tva> {
    try {
      return await this.tvaService.getTvaById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateTva(
    @Param('id') id: string,
    @Body() updateTvaDto: UpdateTvaDto,
  ): Promise<{ message: string; tva: Tva }> {
    try {
      const updatedTva = await this.tvaService.updateTva(id, updateTvaDto);
      return {
        message: 'La TVA a été mise à jour avec succès !',
        tva: updatedTva,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteTva(@Param('id') id: string): Promise<void> {
    try {
      await this.tvaService.deleteTva(id);
      // Si la suppression réussit, renvoyez une réponse 200 OK
      return;
    } catch (error) {
      // Si une erreur se produit, renvoyez une réponse d'erreur avec le code d'état approprié
      throw new HttpException('TVA supprimée avec succès', HttpStatus.OK);
    }
  }

  @Patch(':id')
  async activatedTva(
    @Param('id') id: string,
    @Body() activatedTvaDto: ActivatedTvaDto,
  ) {
    try {
      const updatedTimbre = await this.tvaService.activatedTva(
        id,
        activatedTvaDto,
      );
      return updatedTimbre;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour du statut tva : ${error.message}`,
      );
    }
  }
}
