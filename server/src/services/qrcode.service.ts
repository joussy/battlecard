import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  /**
   * Generates a QR code as an SVG string from the provided URL
   * @param url - The URL to encode in the QR code
   * @returns Promise<string> - The QR code as an SVG string
   */
  async generateSvgFromUrl(url: string): Promise<string> {
    try {
      const svg = await QRCode.toString(url, {
        type: 'svg',
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return svg;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate QR code: ${errorMessage}`);
    }
  }

  async generatePngFromUrl(url: string): Promise<string> {
    try {
      const png = await QRCode.toDataURL(url, {
        type: 'image/png',
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return png;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate QR code PNG: ${errorMessage}`);
    }
  }

  /**
   * Generates a QR code as an SVG string with custom options
   * @param url - The URL to encode in the QR code
   * @param options - Custom options for QR code generation
   * @returns Promise<string> - The QR code as an SVG string
   */
  async generateSvgFromUrlWithOptions(
    url: string,
    options: {
      width?: number;
      margin?: number;
      darkColor?: string;
      lightColor?: string;
    } = {},
  ): Promise<string> {
    try {
      const svg = await QRCode.toString(url, {
        type: 'svg',
        width: options.width || 200,
        margin: options.margin || 2,
        color: {
          dark: options.darkColor || '#000000',
          light: options.lightColor || '#FFFFFF',
        },
      });

      return svg;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate QR code: ${errorMessage}`);
    }
  }
}
