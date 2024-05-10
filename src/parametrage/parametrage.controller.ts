import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ParametrageService } from './parametrage.service';
import { ParametrageDto } from './Dto/parametrage.dto';
import { Parametrage } from './models/parametrage.model';

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
}
