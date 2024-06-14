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
import { TimbreService } from './timbre.service';
import { CreateTimbreDto, UpdateTimbreDto } from './dto/timbre.dto';
import { Timbre } from './models/timbre.model';
import { ActivatedTimbresDto } from './Dto/ActivatedTimbe.dto';

@Controller('timbre')
export class TimbreController {
  constructor(private readonly timbreService: TimbreService) {}

  @Post()
  async createTimbre(
    @Body() createTimbreDto: CreateTimbreDto,
  ): Promise<Timbre> {
    try {
      const createdTimbre =
        await this.timbreService.createTimbre(createTimbreDto);
      return createdTimbre;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllTimbres(): Promise<Timbre[]> {
    try {
      const timbres = await this.timbreService.getAllTimbres();
      return timbres;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getTimbreById(@Param('id') id: string): Promise<Timbre> {
    try {
      const timbre = await this.timbreService.getTimbreById(id);
      return timbre;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async updateTimbre(
    @Param('id') id: string,
    @Body() updateTimbreDto: UpdateTimbreDto,
  ): Promise<Timbre> {
    try {
      const updatedTimbre = await this.timbreService.updateTimbre(
        id,
        updateTimbreDto,
      );
      return updatedTimbre;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteTimbre(@Param('id') id: string): Promise<void> {
    try {
      await this.timbreService.deleteTimbre(id);
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async activatedTimbre(
    @Param('id') id: string,
    @Body() activatedTimbresDto: ActivatedTimbresDto,
  ) {
    try {
      const updatedTimbre = await this.timbreService.activatedTimbres(
        id,
        activatedTimbresDto,
      );
      return updatedTimbre;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour du statut timbre : ${error.message}`,
      );
    }
  }
}
