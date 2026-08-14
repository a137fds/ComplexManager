import React from 'react';
import {
  Building2,
  Globe,
  UserCheck,
  ShieldCheck,
  Bell,
  Eye
} from 'lucide-react';
import { UserRole, Language, ComplexInfo } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  complex: ComplexInfo;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
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

type RoleTranslationKey =
  | 'roleAdmin'
  | 'roleManagementCompany'
  | 'roleChairman'
  | 'roleBoardMember'
  | 'roleFinancialController'
  | 'roleSiteStaff'
  | 'roleResident'
  | 'roleGuest';

const rolesList: { role: UserRole; labelKey: RoleTranslationKey; badgeColor: string; description: string }[] = [
  { role: 'admin', labelKey: 'roleAdmin', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300', description: 'Full system control & soft-delete audit' },
  { role: 'management_company', labelKey: 'roleManagementCompany', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300', description: 'Site operator (soft-deletes only)' },
  { role: 'chairman', labelKey: 'roleChairman', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300', description: 'Board president approvals' },
  { role: 'board_member', labelKey: 'roleBoardMember', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300', description: 'Board member governance' },
  { role: 'financial_controller', labelKey: 'roleFinancialController', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300', description: 'Financial review & checklist audits' },
  { role: 'site_staff', labelKey: 'roleSiteStaff', badgeColor: 'bg-orange-100 text-orange-800 border-orange-300', description: 'On-site caretaker (Kapıcı)' },
  { role: 'resident', labelKey: 'roleResident', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300', description: 'Apartment owner / tenant view' },
  { role: 'guest', labelKey: 'roleGuest', badgeColor: 'bg-slate-100 text-slate-700 border-slate-300', description: 'Unauthenticated visitor overview' },
];

export const Header: React.FC<HeaderProps> = ({
  complex,
  currentRole,
  onRoleChange,
  currentLang,
  onLangChange,
  pendingAuditsCount
}) => {
  const t = translations[currentLang];
  const activeRoleObj = rolesList.find(r => r.role === currentRole) || rolesList[0];

  return (
    <header id="main-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Complex Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-sm ring-2 ring-teal-600/20">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  {complex.name}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  {complex.district}, {complex.city}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {complex.nativeName} • {complex.totalBlocks} Blocks / {complex.totalUnits} Units
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Language Selector */}
            <div className="relative flex items-center">
              <label htmlFor="language-select" className="sr-only">Language</label>
              <div className="flex items-center bg-slate-100/90 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 transition-colors">
                <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                <select
                  id="language-select"
                  value={currentLang}
                  onChange={(e) => onLangChange(e.target.value as Language)}
                  className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  {languagesList.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-teal-600 mr-1.5 shrink-0" />
                <div className="flex flex-col text-left mr-2 hidden sm:flex">
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                    {t.activeRole}
                  </span>
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                    {t[activeRoleObj.labelKey]}
                  </span>
                </div>
                <select
                  id="role-select"
                  aria-label={t.switchRole}
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="bg-white border border-slate-300 text-xs font-semibold text-slate-800 rounded-md px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                >
                  {rolesList.map((r) => (
                    <option key={r.role} value={r.role}>
                      {t[r.labelKey]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pending Audit notification badge (for Financial Controller & Chairman) */}
            {(currentRole === 'financial_controller' || currentRole === 'chairman' || currentRole === 'admin') && pendingAuditsCount > 0 && (
              <div
                title={`${pendingAuditsCount} task(s) awaiting financial inspection/approval`}
                className="hidden lg:flex items-center space-x-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold animate-pulse"
              >
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
