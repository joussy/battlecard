import { Controller, Get, Param, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { id: string };
}

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Get('me')
  async getMe(@Req() req: RequestWithUser): Promise<User> {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const dbUser = await this.userRepository.findOneBy({ id: userId });
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }
    return dbUser;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
