export interface FightCardTemplate {
  title: string;
  subtitle: string;
  fights: {
    boxer1License: string;
    boxer1FirstName: string;
    boxer1LastName: string;
    boxer1Club: string;
    boxer2License: string;
    boxer2FirstName: string;
    boxer2LastName: string;
    boxer2Club: string;
    order: number;
    fightDuration: string; // e.g., "3x2'"
    gender: string;
  }[];
}
