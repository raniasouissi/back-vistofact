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
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './Dto/users.dto';
import { SetPasswordDto } from 'src/client/Dto/set-password.dto';

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

  @UsePipes(new ValidationPipe())
  @Post('set-password/:token')
  async setPassword(
    @Body() setPasswordDto: SetPasswordDto,
    @Param('token') token: string,
  ): Promise<{ message: string }> {
    try {
      await this.service.setPassword(token, setPasswordDto.newPassword);
      return { message: 'Mot de passe réinitialisé avec succès' };
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation du mot de passe :',
        error,
      );
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error(
          'Une erreur est survenue lors de la réinitialisation du mot de passe.',
        );
      }
    }
  }
}
