import { UserSession } from '@/decorators/auth.decorator';
import { User } from '@/entities/user.entity';
import { AuthenticatedUser } from '@/interfaces/auth.interface';
import { Controller, Get, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('me')
  async getMe(@UserSession() user: AuthenticatedUser): Promise<User> {
    const userId = user.id;
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const dbUser = await this.userRepository.findOneBy({ id: userId });
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }
    return dbUser;
  }
}
