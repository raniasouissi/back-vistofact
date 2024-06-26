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
  Patch,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto, UpdateCategorieDto } from './dto/categorie.dto';
import { Categorie } from './models/categorie.model';

import { ActivatedCategoriesDto } from './Dto/activatedCategories.dto';

@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  async createCategorie(
    @Body() createCategorieDto: CreateCategorieDto,
  ): Promise<Categorie> {
    try {
      const createdCategorie =
        await this.categorieService.createCategorie(createCategorieDto);
      return createdCategorie;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllCategories(): Promise<Categorie[]> {
    try {
      const categories = await this.categorieService.getAllCategories();
      return categories;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getCategorieById(@Param('id') id: string): Promise<Categorie> {
    try {
      const categorie = await this.categorieService.getCategorieById(id);
      if (!categorie) {
        throw new HttpException('Catégorie non trouvée', HttpStatus.NOT_FOUND);
      }
      return categorie;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération de la catégorie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateCategorie(
    @Param('id') id: string,
    @Body() updateCategorieDto: UpdateCategorieDto,
  ): Promise<Categorie> {
    try {
      const updatedCategorie = await this.categorieService.updateCategorie(
        id,
        updateCategorieDto,
      );
      if (!updatedCategorie) {
        throw new HttpException('Catégorie non trouvée', HttpStatus.NOT_FOUND);
      }
      return updatedCategorie;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la mise à jour de la catégorie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteCategorie(@Param('id') id: string): Promise<void> {
    try {
      await this.categorieService.deleteCategorie(id);
      return;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la suppression de la catégorie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search/:query')
  async searchCategories(@Param('query') query: string): Promise<Categorie[]> {
    return this.categorieService.searchCategories(query);
  }

  @Patch(':id')
  async activatedCategories(
    @Param('id') id: string,
    @Body() activatedCategoriesDto: ActivatedCategoriesDto,
  ) {
    try {
      const updatedCategory = await this.categorieService.activatedCategories(
        id,
        activatedCategoriesDto,
      );
      return updatedCategory;
    } catch (error) {
      throw new InternalServerErrorException(
        `Une erreur est survenue lors de la mise à jour du statut de la catégorie : ${error.message}`,
      );
    }
  }
}
