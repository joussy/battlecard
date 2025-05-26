import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boxer } from './entities/boxer.entity';
import { toBoxer, toApiBoxer } from './adapters/boxer.adapter';
import { ApiBoxer } from '@/shared/types/api';
import { User } from './decorators/user.decorator';
import { AuthenticatedUser } from './interfaces/auth.interface';

@Controller('boxers')
export class BoxerController {
  constructor(
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  @Get()
  async findAll(): Promise<ApiBoxer[]> {
    const dbBoxers = await this.boxerRepository.find();
    return dbBoxers.map(toApiBoxer);
  }
  @Post()
  async create(
    @Body() boxer: Partial<ApiBoxer>,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxer> {
    boxer.id = undefined;
    boxer.userId = user.id;

    const dbBoxer = await this.boxerRepository.save(toBoxer(boxer as ApiBoxer));
    return toApiBoxer(dbBoxer);
  }

  @Get(':id')
  async getBoxer(@Param('id') id: string): Promise<ApiBoxer> {
    const dbBoxer = await this.boxerRepository.findOneByOrFail({ id });
    return toApiBoxer(dbBoxer);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() boxer: Partial<ApiBoxer>,
  ): Promise<ApiBoxer> {
    await this.boxerRepository.update(id, toBoxer(boxer as ApiBoxer));
    const updated = await this.boxerRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('Boxer not found');
    return toApiBoxer(updated);
  }
}
