import { Language } from '../types';

const locales: Record<Language, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  tr: 'tr-TR',
  fr: 'fr-FR',
  da: 'da-DK',
  sv: 'sv-SE',
  pl: 'pl-PL',
};

export function formatDateTime(value: string | Date | null | undefined, language: Language): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locales[language], {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function formatDate(value: string | Date | null | undefined, language: Language): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(locales[language], { dateStyle: 'short' }).format(date);
}
