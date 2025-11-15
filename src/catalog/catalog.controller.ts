import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  async createItem(@Body() dto: CreateItemDto) {
    return await this.catalogService.createItem(dto);
  }

  @Get(':id')
  async getItem(@Param('id') id: string) {
    return await this.catalogService.getItem(id);
  }

  @Get(':id/suggestions')
  async getSuggestions(@Param('id') id: string) {
    return await this.catalogService.getSuggestions(id);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approveItem(@Param('id') id: string) {
    await this.catalogService.approveItem(id);
    return { message: 'Item approved successfully' };
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectItem(@Param('id') id: string) {
    await this.catalogService.rejectItem(id);
    return { message: 'Item rejected successfully' };
  }
}
