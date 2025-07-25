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
  qrCodeSvg?: string;
  formattedAddress?: string;
}

export interface SelectorTemplate {
  title: string;
  subtitle: string;
  boxers: {
    license: string;
    lastName: string;
    firstName: string;
    weight?: number;
    category: string;
    birthDate: string; // e.g., "01/01/2000"
    nbFights: string;
    club: string;
    gender: string;
  }[];
}
