import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../../database/prisma.service.js';
import { FindUsersQueryDto } from './dto/find-users-query.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Email ${createUserDto.email} já está em uso`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true },
    });
  }

  findAll(query: FindUsersQueryDto) {
    return this.prisma.user.findMany({
      where: {
        email: query.email,
      },
      omit: { password: true },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          `Email ${updateUserDto.email} já está em uso`,
        );
      }
    }

    const password = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : undefined;

    return this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        password,
      },
      select: { id: true, name: true, email: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, email: true },
    });
  }
}
