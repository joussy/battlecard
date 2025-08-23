import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from '@/services/places.service';
import { AddressAutocompleteGetDto } from '@/dto/response.dto';
import { SearchQueryDto } from '@/dto/query.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('autocomplete')
  async autocomplete(
    @Query() query: SearchQueryDto,
  ): Promise<AddressAutocompleteGetDto[]> {
    return await this.placesService.autocomplete(query.q);
  }
}
