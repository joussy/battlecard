import { FightDto } from '@/dto/fight.dto';
import { Fight } from '../entities/fight.entity';

import { FightCardTemplate } from '@/interfaces/template.interface';
import { IModality } from '@/modality/IModality';
import { Tournament } from '@/entities/tournament.entity';
import { format } from 'date-fns';
import { toBoxerDto } from './boxer.adapter';
import { formatAddress } from '@/utils/addressUtils';
import { CreateFightDto } from '@/dto/fight.dto';
import { Gender } from '@/interfaces/modality.interface';
import i18next from 'i18next';
import { DownloadOptionsDto } from '@/dto/share.dto';

export function toFightDto(fight: Fight, modality: IModality): FightDto {
  const fightDuration = modality.getFightDuration(fight.boxer1, fight.boxer2);
  return {
    id: fight.id,
    order: fight.order,
    boxer1: toBoxerDto(fight.boxer1, modality),
    boxer2: toBoxerDto(fight.boxer2, modality),
    tournamentId: fight.tournamentId,
    roundDurationAsSeconds: fightDuration.roundDurationAsSeconds,
    rounds: fightDuration.rounds,
  };
}

export function toFightCardTemplate(
  fights: Fight[],
  tournament: Tournament,
  modality: IModality,
  downloadOptions: DownloadOptionsDto,
  qrCodeSvg?: string,
): Omit<FightCardTemplate, 'i18n'> {
  let colspan = 2;
  if (downloadOptions.displayLicense) colspan++;
  if (downloadOptions.displayBirthdate) colspan++;
  if (downloadOptions.displayWeight) colspan++;
  if (downloadOptions.displayCategory) colspan++;
  const template: Omit<FightCardTemplate, 'i18n'> = {
    subtitle: format(tournament.date, 'dd/MM/yyyy'),
    title: tournament.name,
    cornerColspan: colspan,
    additionalInfo: tournament.additionalInfo,
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
        boxer1Birthdate: fight.boxer1.birthDate
          ? format(new Date(fight.boxer1.birthDate), 'dd/MM/yyyy')
          : '',
        boxer2Birthdate: fight.boxer2.birthDate
          ? format(new Date(fight.boxer2.birthDate), 'dd/MM/yyyy')
          : '',
        boxer1Category: modality.getCategoryName(fight.boxer1, true),
        boxer2Category: modality.getCategoryName(fight.boxer2, true),
        boxer1Weight: `${fight.boxer1.weight?.toString()} kg`,
        boxer2Weight: `${fight.boxer2.weight?.toString()} kg`,
        fightDuration: `${duration.rounds}x${duration.roundDurationAsSeconds / 60}'`,
        gender: fight.boxer1.gender === Gender.MALE ? '♂️' : '♀️',
      };
    }),
    qrCodeSvg: qrCodeSvg,
    downloadOptions: downloadOptions,
  };
  return template;
}

export function toFightCardExportData(fights: Fight[]) {
  return fights.map((fight) => ({
    Order: fight.order,
    [`${i18next.t('template.selector.license')} (${i18next.t('template.fight_card.red_corner')})`]: `${fight.boxer1?.license}`,
    [`${i18next.t('template.selector.full_name')} (${i18next.t('template.fight_card.red_corner')})`]:
      `${fight.boxer1?.firstName || ''} ${fight.boxer1?.lastName || ''}`.trim(),
    [`${i18next.t('template.selector.gym')} (${i18next.t('template.fight_card.red_corner')})`]:
      fight.boxer1?.club || '',
    [`${i18next.t('template.selector.license')} (${i18next.t('template.fight_card.blue_corner')})`]: `${fight.boxer2?.license}`,
    [`${i18next.t('template.selector.full_name')} (${i18next.t('template.fight_card.blue_corner')})`]:
      `${fight.boxer2?.firstName || ''} ${fight.boxer2?.lastName || ''}`.trim(),
    [`${i18next.t('template.selector.gym')} (${i18next.t('template.fight_card.blue_corner')})`]:
      fight.boxer2?.club || '',
  }));
}

export function toFight(fight: FightDto): Fight {
  const entity = new Fight();
  entity.id = fight.id;
  entity.order = fight.order;
  entity.boxer1Id = fight.boxer1.id;
  entity.boxer2Id = fight.boxer2.id;
  entity.tournamentId = fight.tournamentId;
  return entity;
}

export function toFightFromCreateDto(fight: CreateFightDto): Fight {
  const entity = new Fight();
  entity.order = fight.order;
  entity.boxer1Id = fight.boxer1Id;
  entity.boxer2Id = fight.boxer2Id;
  entity.tournamentId = fight.tournamentId;
  return entity;
}
