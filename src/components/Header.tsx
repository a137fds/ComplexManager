import React from 'react';
import { Building2, Globe, Bell } from 'lucide-react';
import { Language, ComplexInfo } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  complex: ComplexInfo;
  currentRole: string;
  onRoleChange: (role: any) => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  pendingAuditsCount: number;
}

const languagesList: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
];

export const Header: React.FC<HeaderProps> = ({ complex, currentLang, onLangChange, pendingAuditsCount }) => {
  const t = translations[currentLang];

  return (
    <header id="main-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-sm ring-2 ring-teal-600/20">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">{complex.name}</h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">{complex.district}, {complex.city}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{complex.nativeName} • {complex.totalBlocks} Blocks / {complex.totalUnits} Units</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center bg-slate-100/90 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <select id="language-select" value={currentLang} onChange={(e) => onLangChange(e.target.value as Language)} className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1">
                {languagesList.map(lang => <option key={lang.code} value={lang.code}>{lang.flag} {lang.label}</option>)}
              </select>
            </div>
            {pendingAuditsCount > 0 && (
              <div title={`${pendingAuditsCount} task(s) awaiting financial inspection/approval`} className="hidden lg:flex items-center space-x-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold">
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>{pendingAuditsCount} Action{pendingAuditsCount > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
