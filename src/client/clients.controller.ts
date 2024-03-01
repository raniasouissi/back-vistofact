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

@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  async findAll() {
    return this.service.getAllClients();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: ClientDto) {
    return this.service.createClient(body);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.FindOne(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() body: ClientDto) {
    return this.service.updateClient(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.service.deleteClient(id);
  }
}
