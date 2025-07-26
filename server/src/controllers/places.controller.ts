import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from '@/services/places.service';
import { ApiAddressAutocompleteGet } from '@/shared/types/api';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('autocomplete')
  async autocomplete(
    @Query('q') query: string,
  ): Promise<ApiAddressAutocompleteGet[]> {
    return await this.placesService.autocomplete(query);
  }
}
