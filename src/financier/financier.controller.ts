// financier.controller.ts

import {
  Controller,
  Get,
  Post,
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

@Controller('financiers')
export class FinancierController {
  constructor(private financierService: FinancierService) {}
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: FinancierDto) {
    return this.financierService.createFinancier(body);
  }

  @Get()
  async findAll(): Promise<Financier[]> {
    return this.financierService.getAllFinanciers();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.financierService.findOne(id);
  }
  @UsePipes(new ValidationPipe())
  @Put('/:id')
  update(@Param('id') id: string, @Body() body: FinancierDto) {
    return this.financierService.updateFinancier(id, body);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.financierService.deleteFinancier(id);
  }
}
