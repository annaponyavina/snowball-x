import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/shared/lib/storage'
import ru from '@/shared/i18n/ru.json'
import en from '@/shared/i18n/en.json'

export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: Language = 'ru'

const languageSchema = z.enum(SUPPORTED_LANGUAGES)

function initialLanguage(): Language {
  return readStorage(STORAGE_KEYS.language, languageSchema, DEFAULT_LANGUAGE)
}

void i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: initialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
})

/** Сменить язык интерфейса и сохранить выбор. */
export function setLanguage(language: Language): void {
  void i18n.changeLanguage(language)
  writeStorage(STORAGE_KEYS.language, language)
}

export default i18n
