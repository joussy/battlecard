import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { BoxerService } from '../services/boxer.service';
import { ModalityService } from '../modality/modality.service';
import { ApiBoxerGet, ApiBoxerCreate } from '@/shared/types/api';
import { User } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../interfaces/auth.interface';

@Controller('boxers')
export class BoxerController {
  constructor(
    private readonly boxerService: BoxerService,
    private readonly modalityService: ModalityService,
  ) {}

  @Post()
  async create(
    @Body() boxer: ApiBoxerCreate,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    return this.boxerService.create(boxer, user);
  }

  @Get(':id')
  async getBoxer(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    return this.boxerService.getBoxer(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') boxerId: string,
    @Body() boxer: ApiBoxerCreate,
    @User() user: AuthenticatedUser,
  ): Promise<ApiBoxerGet> {
    return this.boxerService.update(boxerId, boxer, user);
  }
}
