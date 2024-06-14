// clients.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
  InternalServerErrorException,
} from '@nestjs/common';

import { ClientDto } from './dto/clients.dto';
import { ClientsService } from './client.service';
import { Client } from './models/clients.models';
//import { MulterFile } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivatedClientDto } from './Dto/ActivatedClient.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  async signUpClient(
    @UploadedFile() image: Express.Multer.File,
    @Body() signUpDto: ClientDto,
  ): Promise<{ message: string; result: any }> {
    try {
      const imageUrl = image ? image.filename : '';

      const result = await this.service.signUpClient(signUpDto, imageUrl);

      return result;
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw new Error("Une erreur est survenue lors de l'inscription.");
    }
  }
  @Get()
  async findAll() {
    return this.service.getAllClients();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.FindOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateClient(
    @Param('id') id: string,
    @Body() body: ClientDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    try {
      const imageUrl = image ? image.filename : ''; // Récupérer le nom du fichier de l'image
      await this.service.updateClient(id, body, imageUrl);
      return 'Client has been updated successfully';
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client :', error);
      throw new Error(
        'Une erreur est survenue lors de la mise à jour du client.',
      );
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.service.deleteClient(id);
  }
  @Get('search/:query')
  async searchClients(@Param('query') query: string): Promise<Client[] | null> {
    try {
      if (!query) {
        return null; // Ou renvoyez une liste vide selon votre logique
      }
      return this.service.searchClients(query);
    } catch (error) {
      console.error('Erreur lors de la recherche des clients :', error);
      throw new Error(
        'Une erreur est survenue lors de la recherche des clients.',
      );
    }
  }

  @Patch(':id')
  async activatedClients(
    @Param('id') id: string,
    @Body() activatedClientDto: ActivatedClientDto,
  ) {
    try {
      const updatedclient = await this.service.activatedClients(
        id,
        activatedClientDto,
      );
      return updatedclient;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour du statut timbre : ${error.message}`,
      );
    }
  }
}
