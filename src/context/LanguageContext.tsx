import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Champion, Role } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['ko'], params?: Record<string, string | number>) => string;
  getChampName: (champ: Champion | null | undefined) => string;
  getRoleName: (role: Role) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('draft_gg_lang');
    if (saved === 'en' || saved === 'ko') return saved;
    // Default to Korean if browser language is Korean, otherwise English or Korean
    return navigator.language.startsWith('ko') ? 'ko' : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('draft_gg_lang', newLang);
  };

  const t = (key: keyof typeof TRANSLATIONS['ko'], params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ko'];
    let text = (dict as any)[key] ?? (TRANSLATIONS['ko'] as any)[key] ?? key;

    if (params && typeof text === 'string') {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return text;
  };

  const getChampName = (champ: Champion | null | undefined): string => {
    if (!champ) return '';
    return lang === 'en' ? champ.name : champ.nameKo;
  };

  const getRoleName = (role: Role): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['ko'];
    return dict.roles[role] || role;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, getChampName, getRoleName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
