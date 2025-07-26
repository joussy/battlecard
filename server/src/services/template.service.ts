import {
  FightCardTemplate,
  SelectorTemplate,
} from '@/interfaces/template.interface';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Mustache from 'mustache';
import * as path from 'path';
import { ConfigService } from './config.service';

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
    return this.renderMustache(template, fightCardTemplate);
  }

  public generateSelectorHtml(selectorTemplate: SelectorTemplate): string {
    const template = this.loadTemplate('selector');
    if (!template) {
      throw new Error(`Template 'selector' not found`);
    }
    return this.renderMustache(template, selectorTemplate);
  }
}
