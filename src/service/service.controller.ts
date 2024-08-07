// service.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Patch,
  InternalServerErrorException,
} from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServicesDto } from './Dto/service.dto';
import { Service } from './models/service.model';
import { ActivatedServicesDto } from './Dto/activatedservices.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() serviceDto: ServicesDto): Promise<string> {
    try {
      await this.servicesService.create(serviceDto);
      return 'Service ajouté avec succès';
    } catch (error) {
      // Gérer les erreurs ici si nécessaire
      throw new Error("Une erreur s'est produite lors de l'ajout du service.");
    }
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

  @Get('search/:query')
  async searchServices(@Param('query') query: string): Promise<Service[]> {
    return this.servicesService.searchServices(query);
  }

  /*@Patch(':id')
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: Partial<ServicesDto>,
  ) {
    return this.servicesService.updateService(id, updateServiceDto);
  }*/

  @Patch(':id')
  async activatedServices(
    @Param('id') id: string,
    @Body() activatedServicesDto: ActivatedServicesDto,
  ) {
    try {
      const updatedService = await this.servicesService.activatedServices(
        id,
        activatedServicesDto,
      );
      return updatedService;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour du statut de la service : ${error.message}`,
      );
    }
  }
}
