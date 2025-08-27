import { Request, Response, NextFunction } from 'express';
import i18next from 'i18next';

// Middleware to set i18next language per request using Accept-Language header
export default function i18nMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Accept-Language can be string | string[] | undefined
  const rawHeader = req.headers['accept-language'] as
    | string
    | string[]
    | undefined;

  const header: string | undefined = Array.isArray(rawHeader)
    ? rawHeader[0]
    : rawHeader;

  if (typeof header === 'string' && header.length > 0) {
    // e.g. "fr-FR,fr;q=0.9" -> "fr-FR" -> "fr"
    const raw = header.split(',')[0].split(';')[0].trim();
    const primary = raw.split('-')[0].toLowerCase();
    const lang = primary === 'fr' ? 'fr' : 'en';

    // Set i18next language for this request (best-effort)
    void i18next.changeLanguage(lang);

    // Store selected language on res.locals for handlers that need it
    res.locals.language = lang;
  }

  next();
}
