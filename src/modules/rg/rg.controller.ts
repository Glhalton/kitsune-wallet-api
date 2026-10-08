import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RgService } from './rg.service.js';
import { CreateRgDto } from './dto/create-rg.dto.js';
import { UpdateRgDto } from './dto/update-rg.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/auth.guard.js';

@Controller('rg')
export class RgController {
  constructor(private readonly rgService: RgService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createRgDto: CreateRgDto,
  ) {
    return this.rgService.create(user.id, createRgDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.rgService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.rgService.findOne(user.id, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateRgDto: UpdateRgDto,
  ) {
    return this.rgService.update(user.id, +id, updateRgDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.rgService.remove(user.id, +id);
  }
}
