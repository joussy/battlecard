import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from '@/services/places.service';
import { ApiAddressAutocompleteGet } from '@/shared/types/api';
import { SearchQueryDto } from '@/dto/query.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('autocomplete')
  async autocomplete(
    @Query() query: SearchQueryDto,
  ): Promise<ApiAddressAutocompleteGet[]> {
    return await this.placesService.autocomplete(query.q);
  }
}
