import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ElectoralCardsService } from './electoral-cards.service.js';
import { CreateElectoralCardDto } from './dto/create-electoral-card.dto.js';
import { UpdateElectoralCardDto } from './dto/update-electoral-card.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/auth.guard.js';

@Controller('electoral-cards')
export class ElectoralCardsController {
  constructor(private readonly electoralCardsService: ElectoralCardsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createElectoralCardDto: CreateElectoralCardDto,
  ) {
    return this.electoralCardsService.create(user.id, createElectoralCardDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.electoralCardsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.electoralCardsService.findOne(user.id, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateElectoralCardDto: UpdateElectoralCardDto,
  ) {
    return this.electoralCardsService.update(
      user.id,
      +id,
      updateElectoralCardDto,
    );
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.electoralCardsService.remove(user.id, +id);
  }
}
