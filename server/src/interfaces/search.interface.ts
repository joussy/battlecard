// Logical entity for MeiliSearch indexing
export interface IndexedBoxer {
  id: string;
  name: string;
  weight?: number;
  birthDate: string;
  club: string;
  license: string;
  gender: string;
  nbFights: number;
}
