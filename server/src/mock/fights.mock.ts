import { DeepPartial } from 'typeorm';
import { Fight } from '../entities/fight.entity';

// This function returns an array of DeepPartial<Fight> objects for seeding
// boxer1Id, boxer2Id, and tournamentId must be filled in at runtime
export const mockFights: Omit<
  DeepPartial<Fight>,
  'boxer1Id' | 'boxer2Id' | 'tournamentId'
>[] = [
  {
    order: 1,
    // boxer1Id: boxers[0].id, // Ali
    // boxer2Id: boxers[1].id, // Tyson
    // tournamentId: tournament.id,
  },
  {
    order: 2,
    // boxer1Id: boxers[2].id, // Mayweather
    // boxer2Id: boxers[3].id, // Pacquiao
    // tournamentId: tournament.id,
  },
  {
    order: 3,
    // boxer1Id: boxers[4].id, // Holm
    // boxer2Id: boxers[5].id, // Shields
    // tournamentId: tournament.id,
  },
  {
    order: 4,
    // boxer1Id: boxers[6].id, // Taylor
    // boxer2Id: boxers[7].id, // Serrano
    // tournamentId: tournament.id,
  },
  {
    order: 5, // Jonas vs Shields (female fight)
    // boxer1Id: Jonas, boxer2Id: Shields
  },
  {
    order: 6, // Joshua vs Tyson (male fight)
    // boxer1Id: Joshua, boxer2Id: Tyson
  },
];
