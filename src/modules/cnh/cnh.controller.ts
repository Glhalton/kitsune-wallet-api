import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CnhService } from './cnh.service.js';
import { CreateCnhDto } from './dto/create-cnh.dto.js';
import { UpdateCnhDto } from './dto/update-cnh.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/auth.guard.js';

@Controller('cnh')
export class CnhController {
  constructor(private readonly cnhService: CnhService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createCnhDto: CreateCnhDto,
  ) {
    return this.cnhService.create(user.id, createCnhDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.cnhService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cnhService.findOne(user.id, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateCnhDto: UpdateCnhDto,
  ) {
    return this.cnhService.update(user.id, +id, updateCnhDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cnhService.remove(user.id, +id);
  }
}
