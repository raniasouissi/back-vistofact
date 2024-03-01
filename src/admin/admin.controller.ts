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
import { AdminsService } from './admin.service';
import { Admin } from './models/admin.models';
import { AdminDto } from './dto/admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() body: AdminDto) {
    return this.adminsService.createAdmin(body);
  }

  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminsService.getAllAdmins();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }
  @UsePipes(new ValidationPipe())
  @Put('/:id')
  update(@Param('id') id: string, @Body() body: AdminDto) {
    return this.adminsService.updateAdmin(id, body);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.adminsService.deleteAdmin(id);
  }
}
