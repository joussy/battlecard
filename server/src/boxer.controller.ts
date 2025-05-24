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

@Controller('boxers')
export class BoxerController {
  constructor(
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  @Get()
  async findAll(): Promise<Boxer[]> {
    return this.boxerRepository.find();
  }

  @Post()
  async create(@Body() boxer: Partial<Boxer>): Promise<Boxer> {
    if ('id' in boxer) {
      delete boxer.id;
    }
    return this.boxerRepository.save(boxer);
  }

  @Get(':id')
  async getBoxer(@Param('id') id: string): Promise<Boxer> {
    return this.boxerRepository.findOneByOrFail({ id });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() boxer: Partial<Boxer>,
  ): Promise<Boxer> {
    await this.boxerRepository.update(id, boxer);
    const updated = await this.boxerRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('Boxer not found');
    return updated;
  }
}
