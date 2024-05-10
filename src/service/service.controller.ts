// service.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServicesDto } from './Dto/service.dto';
import { Service } from './models/service.model';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() serviceDto: ServicesDto) {
    return this.servicesService.create(serviceDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Service> {
    return this.servicesService.findById(id);
  }

  @Get()
  async findAll(): Promise<ServicesDto[]> {
    return this.servicesService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() serviceDto: ServicesDto) {
    return this.servicesService.update(id, serviceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
