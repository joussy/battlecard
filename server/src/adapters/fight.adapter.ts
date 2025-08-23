import { FightGetDto } from '@/dto/response.dto';
import { Fight } from '../entities/fight.entity';
import { Gender } from '@/shared/types/modality.type';
import { FightCardTemplate } from '@/interfaces/template.interface';
import { IModality } from '@/modality/IModality';
import { Tournament } from '@/entities/tournament.entity';
import { format } from 'date-fns';
import { toBoxerGetDto } from './boxer.adapter';
import { formatAddress } from '@/utils/addressUtils';
import { CreateFightDto } from '@/dto/fight.dto';

export function toFightGetDto(fight: Fight, modality: IModality): FightGetDto {
  const fightDuration = modality.getFightDuration(fight.boxer1, fight.boxer2);
  return {
    id: fight.id,
    order: fight.order,
    boxer1: toBoxerGetDto(fight.boxer1, modality),
    boxer2: toBoxerGetDto(fight.boxer2, modality),
    tournamentId: fight.tournamentId,
    roundDurationAsSeconds: fightDuration.roundDurationAsSeconds,
    rounds: fightDuration.rounds,
  };
}

export function toFightCardTemplate(
  fights: Fight[],
  tournament: Tournament,
  modality: IModality,
  qrCodeSvg?: string,
): FightCardTemplate {
  const template: FightCardTemplate = {
    subtitle: format(tournament.date, 'dd/MM/yyyy'),
    title: tournament.name,
    formattedAddress: formatAddress({
      street: tournament.address,
      city: tournament.city,
      zipCode: tournament.zipCode,
    }),
    fights: fights.map((fight) => {
      const duration = modality.getFightDuration(fight.boxer1, fight.boxer2);
      return {
        order: fight.order,
        boxer1License: fight.boxer1.license,
        boxer1FirstName: fight.boxer1.firstName,
        boxer1LastName: fight.boxer1.lastName,
        boxer1Club: fight.boxer1.club,
        boxer2License: fight.boxer2.license,
        boxer2Club: fight.boxer2.club,
        boxer2FirstName: fight.boxer2.firstName,
        boxer2LastName: fight.boxer2.lastName,
        fightDuration: `${duration.rounds}x${duration.roundDurationAsSeconds / 60}'`,
        gender: fight.boxer1.gender === Gender.MALE ? '♂️' : '♀️',
      };
    }),
    qrCodeSvg: qrCodeSvg,
  };
  return template;
}

export function toFightCardExportData(fights: Fight[]) {
  return fights.map((fight) => ({
    Order: fight.order,
    'Red Licence': `${fight.boxer1?.license}`,
    'Red Boxer':
      `${fight.boxer1?.firstName || ''} ${fight.boxer1?.lastName || ''}`.trim(),
    'Red Club': fight.boxer1?.club || '',
    'Blue Licence': `${fight.boxer2?.license}`,
    'Blue Boxer':
      `${fight.boxer2?.firstName || ''} ${fight.boxer2?.lastName || ''}`.trim(),
    'Blue Club': fight.boxer2?.club || '',
  }));
}

export function toFight(fight: FightGetDto): Fight {
  const entity = new Fight();
  entity.id = fight.id;
  entity.order = fight.order;
  entity.boxer1Id = fight.boxer1.id;
  entity.boxer2Id = fight.boxer2.id;
  entity.tournamentId = fight.tournamentId;
  return entity;
}
