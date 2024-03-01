import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './Dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UsePipes(new ValidationPipe()) // Utilisez le pipe de validation ici
  @Post()
  Add(@Body() body: UserDto) {
    return this.service.Add(body);
  }

  @Get()
  FindAll(@Query('key') key) {
    {
      return this.service.FindAll(key);
    }
  }

  @Get('/:id')
  FindOne(@Param('id') id: string) {
    return this.service.FindOne(id);
  }
  @UsePipes(new ValidationPipe())
  @Put('/:id')
  Update(@Param('id') id: string, @Body() body: UserDto) {
    return this.service.updateUser(id, body);
  }

  @Delete('/:id')
  Delete(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
