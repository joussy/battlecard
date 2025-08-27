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

export interface FightCardI18nTemplate {
  order: string;
  red_corner: string;
  blue_corner: string;
  duration: string;
  gender: string;
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

export interface SelectI18nTemplate {
  license: string;
  last_name: string;
  first_name: string;
  weight: string;
  category: string;
  birth_date: string;
  number_of_fights: string;
  gym: string;
  gender: string;
}
