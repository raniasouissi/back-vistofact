import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { ParametrageService } from './parametrage.service';
import { ParametrageDto } from './Dto/parametrage.dto';
import { Parametrage } from './models/parametrage.model';
import { ActivatedParametragesDto } from './Dto/ActivatedParmetrage.dto';

@Controller('parametrage')
export class ParametrageController {
  constructor(private readonly parametrageService: ParametrageService) {}

  @Post('company')
  create(@Body() parametrageDto: ParametrageDto): Promise<Parametrage> {
    return this.parametrageService.create(parametrageDto);
  }

  @Get()
  findAll(): Promise<Parametrage[]> {
    return this.parametrageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Parametrage> {
    return this.parametrageService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() parametrageDto: ParametrageDto,
  ): Promise<string> {
    return this.parametrageService.updateParametrage(id, parametrageDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Parametrage> {
    return this.parametrageService.delete(id);
  }

  @Get('search/:query')
  search(@Param('query') query: string): Promise<Parametrage[]> {
    return this.parametrageService.searchParametrages(query);
  }

  @Patch(':id')
  async activatedParametrages(
    @Param('id') id: string,
    @Body() activatedParametragesDto: ActivatedParametragesDto,
  ) {
    try {
      const updatedParametrage =
        await this.parametrageService.activatedParametrages(
          id,
          activatedParametragesDto,
        );
      return updatedParametrage;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour du statut de parametrage : ${error.message}`,
      );
    }
  }
}
