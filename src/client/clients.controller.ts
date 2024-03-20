// clients.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ClientDto } from './dto/clients.dto';
import { ClientsService } from './client.service';
import { Client } from './models/clients.models';

@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}
  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signUpClient(
    @Body() signUpDto: ClientDto,
  ): Promise<{ message: string; result: any }> {
    return this.service.signUpClient(signUpDto);
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
  async updateClient(
    @Param('id') id: string,
    @Body() body: ClientDto,
  ): Promise<string> {
    try {
      await this.service.updateClient(id, body);
      return 'Client has been updated successfully';
    } catch (error) {
      throw new Error(error);
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
}
