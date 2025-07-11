import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GotenbergService {
  constructor(private readonly configService: ConfigService) {}

  async generatePdf(html: string): Promise<Buffer> {
    const formData = new FormData();
    // Use Blob for browser and Node.js compatibility
    const htmlBlob = new Blob([html], { type: 'text/html' });
    formData.append('files', htmlBlob, 'index.html');
    formData.append('index.html', 'index.html');
    formData.append('landscape', 'true');

    // Send HTML to Gotenberg for PDF conversion
    const gotenbergUrl = this.configService.get<string>('GOTENBERG_URL');
    if (!gotenbergUrl) {
      throw new Error('PDF generation service not available');
    }

    const gotenbergRes = await fetch(
      `${gotenbergUrl}/forms/chromium/convert/html`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!gotenbergRes.ok) {
      console.error('Gotenberg response error:', gotenbergRes.statusText);
      throw new Error('Failed to generate PDF with Gotenberg.');
    }

    return Buffer.from(await gotenbergRes.arrayBuffer());
  }

  async generatePng(html: string): Promise<Buffer> {
    const formData = new FormData();
    // Use Blob for browser and Node.js compatibility
    const htmlBlob = new Blob([html], { type: 'text/html' });
    formData.append('files', htmlBlob, 'index.html');
    formData.append('index.html', 'index.html');
    formData.append('clip', 'false');
    formData.append('skipNetworkIdleEvent', 'false');

    // Send HTML to Gotenberg for PNG conversion
    const gotenbergUrl = this.configService.get<string>('GOTENBERG_URL');
    if (!gotenbergUrl) {
      throw new Error('Image generation service not available');
    }

    const gotenbergRes = await fetch(
      `${gotenbergUrl}/forms/chromium/screenshot/html`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!gotenbergRes.ok) {
      console.error('Gotenberg response error:', gotenbergRes.statusText);
      throw new Error('Failed to generate PNG with Gotenberg.');
    }

    return Buffer.from(await gotenbergRes.arrayBuffer());
  }
}
