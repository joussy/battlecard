import {
  FightCardI18nTemplate,
  FightCardTemplate,
  SelectI18nTemplate,
  SelectorTemplate,
} from '@/interfaces/template.interface';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Mustache from 'mustache';
import * as path from 'path';
import { ConfigService } from './config.service';
import i18next from 'i18next';

@Injectable()
export class TemplateService {
  constructor(private readonly configService: ConfigService) {}
  private readonly templates: Map<string, string> = new Map();

  private loadTemplate(name: string): string | undefined {
    const templatePath = path.join(
      __dirname,
      '..',
      'views',
      `${name}.mustache`,
    );
    if (this.configService.getConfig().environment === 'development') {
      // In development mode, always read fresh from disk
      return fs.readFileSync(templatePath, 'utf-8');
    }

    // In production mode, use caching
    if (!this.templates.has(name)) {
      const content = fs.readFileSync(templatePath, 'utf-8');
      this.templates.set(name, content);
    }
    return this.templates.get(name);
  }

  private renderMustache(template: string, fightCardTemplate: any): string {
    return Mustache.render(template, fightCardTemplate);
  }

  public generateFightCardHtml(fightCardTemplate: FightCardTemplate): string {
    const template = this.loadTemplate('fight-card');
    if (!template) {
      throw new Error(`Template 'fight-card' not found`);
    }

    // Add i18n translations to the template data
    const i18nTemplate: FightCardI18nTemplate = {
      order: i18next.t('template.fight_card.order'),
      red_corner: i18next.t('template.fight_card.red_corner'),
      blue_corner: i18next.t('template.fight_card.blue_corner'),
      duration: i18next.t('template.fight_card.duration'),
      gender: i18next.t('template.fight_card.gender'),
    };

    return this.renderMustache(template, {
      ...fightCardTemplate,
      i18n: i18nTemplate,
    });
  }

  public generateSelectorHtml(selectorTemplate: SelectorTemplate): string {
    const template = this.loadTemplate('selector');
    if (!template) {
      throw new Error(`Template 'selector' not found`);
    }

    // Add i18n translations to the template data
    const i18nTemplate: SelectI18nTemplate = {
      license: i18next.t('template.selector.license'),
      last_name: i18next.t('template.selector.last_name'),
      first_name: i18next.t('template.selector.first_name'),
      weight: i18next.t('template.selector.weight'),
      category: i18next.t('template.selector.category'),
      birth_date: i18next.t('template.selector.birth_date'),
      number_of_fights: i18next.t('template.selector.number_of_fights'),
      gym: i18next.t('template.selector.gym'),
      gender: i18next.t('template.selector.gender'),
    };

    return this.renderMustache(template, {
      ...selectorTemplate,
      i18n: i18nTemplate,
    });
  }
}
