import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './Dto/service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    try {
      const createdService = await this.serviceService.create(createServiceDto);
      return { message: 'Service created successfully', data: createdService };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const services = await this.serviceService.findAll();
      return { message: 'Services fetched successfully', data: services };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const service = await this.serviceService.findOne(id);
      return { message: 'Service fetched successfully', data: service };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: CreateServiceDto,
  ) {
    try {
      const updatedService = await this.serviceService.update(
        id,
        updateServiceDto,
      );
      return { message: 'Service updated successfully', data: updatedService };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.serviceService.remove(id);
      return { message: 'Service deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
