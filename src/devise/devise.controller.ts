import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { DeviseService } from './devise.service';
import { CreateDeviseDto } from './Dto/devise.dto';

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
}
