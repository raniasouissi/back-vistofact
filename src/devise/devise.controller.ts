import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { DeviseService } from './devise.service';
import { CreateDeviseDto } from './Dto/devise.dto';
import { ActivatedDeviseDto } from './Dto/ActivatedDevise.dto';

@Controller('devise')
export class DeviseController {
  constructor(private readonly deviseService: DeviseService) {}

  @Post()
  async create(@Body() createDeviseDto: CreateDeviseDto) {
    return this.deviseService.createDevise(createDeviseDto);
  }

  @Get()
  async findAll() {
    return this.deviseService.getAllDevises();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deviseService.getDeviseById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeviseDto: CreateDeviseDto,
  ) {
    return this.deviseService.updateDevise(id, updateDeviseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deviseService.deleteDevise(id);
  }

  @Patch(':id')
  async activatedDevise(
    @Param('id') id: string,
    @Body() activatedDevisesDto: ActivatedDeviseDto,
  ) {
    try {
      const updatedDevise = await this.deviseService.activatedDevises(
        id,
        activatedDevisesDto,
      );
      return updatedDevise;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour du statut timbre : ${error.message}`,
      );
    }
  }
}
