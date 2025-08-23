import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { BoxerService } from '../services/boxer.service';
import { ModalityService } from '../modality/modality.service';
import { ApiBoxerGet } from '@/shared/types/api';
import { User } from '../decorators/auth.decorator';
import { AuthenticatedUser } from '../interfaces/auth.interface';
import { CreateBoxerDto, UpdateBoxerDto } from '@/dto/boxer.dto';
import { IdParamsDto } from '@/dto/params.dto';

@Controller('boxers')
export class BoxerController {
  constructor(
    private readonly boxerService: BoxerService,
    private readonly modalityService: ModalityService,
  ) {}

  @Post()
  async create(
    @Body() boxer: CreateBoxerDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    return this.boxerService.create(boxer, user);
  }

  @Get(':id')
  async getBoxer(
    @Param() params: IdParamsDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    return this.boxerService.getBoxer(params.id, user);
  }

  @Put(':id')
  async update(
    @Param() params: IdParamsDto,
    @Body() boxer: UpdateBoxerDto,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    return this.boxerService.update(params.id, boxer, user);
  }
}
