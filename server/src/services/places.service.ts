import { AddressAutocompleteGetDto } from '@/dto/response.dto';
import { formatAddress } from '../utils/addressUtils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

@Injectable()
export class PlacesService {
  constructor(private readonly configService: ConfigService) {}

  async autocomplete(query: string): Promise<AddressAutocompleteGetDto[]> {
    if (!query) return [];
    const apiKey = this.configService.getConfig().geoapifyApiKey;
    if (!apiKey) {
      throw new Error('Geoapify API key is not configured');
    }
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      const json = (await response.json()) as {
        features?: Array<{
          properties?: {
            city: string;
            street: string;
            postcode: string;
          };
        }>;
      };
      const features = json.features || [];
      return features.map<AddressAutocompleteGetDto>((feature) => ({
        city: feature.properties?.city || '',
        street: feature.properties?.street || '',
        zipCode: feature.properties?.postcode || '',
        formatted: formatAddress(feature.properties),
      }));
    } catch {
      return [];
    }
  }
}
