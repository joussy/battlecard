import { MeiliSearch } from 'meilisearch';

export const MeiliSearchProvider = {
  provide: 'MEILI_CLIENT',
  useFactory: () => {
    return new MeiliSearch({
      host: process.env.MEILI_HOST || 'http://127.0.0.1:7700',
      apiKey: process.env.MEILI_API_KEY || '',
    });
  },
};
