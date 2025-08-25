import {
  FightCardTemplate,
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

  public generateFightCardHtml(
    fightCardTemplate: Omit<FightCardTemplate, 'i18n'>,
    language: string = 'en',
  ): string {
    const template = this.loadTemplate('fight-card');
    if (!template) {
      throw new Error(`Template 'fight-card' not found`);
    }

    // Add i18n translations to the template data
    const templateWithI18n: FightCardTemplate = {
      ...fightCardTemplate,
      i18n: {
        order: i18next.t('template.fight_card.order', { lng: language }),
        red_corner: i18next.t('template.fight_card.red_corner', {
          lng: language,
        }),
        blue_corner: i18next.t('template.fight_card.blue_corner', {
          lng: language,
        }),
        duration: i18next.t('template.fight_card.duration', { lng: language }),
        gender: i18next.t('template.fight_card.gender', { lng: language }),
      },
    };

    return this.renderMustache(template, templateWithI18n);
  }

  public generateSelectorHtml(
    selectorTemplate: Omit<SelectorTemplate, 'i18n'>,
    language: string = 'en',
  ): string {
    const template = this.loadTemplate('selector');
    if (!template) {
      throw new Error(`Template 'selector' not found`);
    }

    // Add i18n translations to the template data
    const templateWithI18n: SelectorTemplate = {
      ...selectorTemplate,
      i18n: {
        license: i18next.t('template.selector.license', { lng: language }),
        last_name: i18next.t('template.selector.last_name', { lng: language }),
        first_name: i18next.t('template.selector.first_name', {
          lng: language,
        }),
        weight: i18next.t('template.selector.weight', { lng: language }),
        category: i18next.t('template.selector.category', { lng: language }),
        birth_date: i18next.t('template.selector.birth_date', {
          lng: language,
        }),
        number_of_fights: i18next.t('template.selector.number_of_fights', {
          lng: language,
        }),
        gym: i18next.t('template.selector.gym', { lng: language }),
        gender: i18next.t('template.selector.gender', { lng: language }),
      },
    };

    return this.renderMustache(template, templateWithI18n);
  }
}
