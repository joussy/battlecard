import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BoxerService } from '../services/boxer.service';
import { ModalityService } from '../modality/modality.service';
import { BoxerDto } from '@/dto/boxer.dto';
import { UserSession } from '../decorators/auth.decorator';
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
    @UserSession() user: AuthenticatedUser,
  ): Promise<BoxerDto> {
    return this.boxerService.create(boxer, user);
  }

  @Get(':id')
  async getBoxer(
    @Param() params: IdParamsDto,
    @UserSession() user: AuthenticatedUser,
  ): Promise<BoxerDto> {
    return this.boxerService.getBoxer(params.id, user);
  }

  @Put(':id')
  async update(
    @Param() params: IdParamsDto,
    @Body() boxer: UpdateBoxerDto,
    @UserSession() user: AuthenticatedUser,
  ): Promise<BoxerDto> {
    return this.boxerService.update(params.id, boxer, user);
  }

  @Delete(':id')
  async delete(
    @Param() params: IdParamsDto,
    @UserSession() user: AuthenticatedUser,
  ): Promise<void> {
    return this.boxerService.delete(params.id, user);
  }
}
