import React from 'react';
import { Building2, Layers, Users, CreditCard, Wrench, FileText, Settings, Info, Home, AlertTriangle } from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';
import { useAuth } from '../auth/AuthContext';

export type TabType = 'start_page' | 'complex' | 'buildings' | 'residents' | 'billing' | 'tasks' | 'documents' | 'administration' | 'errors' | 'guest_overview';
interface SidebarProps { currentTab: TabType; onTabSelect: (tab: TabType) => void; currentRole: UserRole; currentLang: Language; }
const startLabels: Record<Language, { start: string; settings: string; role: string; roleDesc: string; law: string; governance: string; apartments: string; errors: string }> = {
  en: { start: 'Start Page', settings: 'Administration', role: 'Role Permissions', roleDesc: 'Permissions are managed centrally in Administration by an administrator.', law: '634 Sayılı Kat Mülkiyeti Kanunu', governance: 'Complex Governance & Audit Standard', apartments: 'Apartments', errors: 'Errors' },
  ru: { start: 'Обзор', settings: 'Администрирование', role: 'Права ролей', roleDesc: 'Права доступа централизованно управляются администратором в разделе администрирования.', law: 'Закон Турции №634 о кондоминиумах', governance: 'Управление комплексом и аудит', apartments: 'Квартиры', errors: 'Ошибки' },
  tr: { start: 'Genel Bakış', settings: 'Yönetim', role: 'Rol Yetkileri', roleDesc: 'Yetkiler yönetici tarafından Yönetim bölümünde merkezi olarak yönetilir.', law: '634 Sayılı Kat Mülkiyeti Kanunu', governance: 'Kompleks Yönetimi ve Denetim Standardı', apartments: 'Daireler', errors: 'Hatalar' },
  fr: { start: 'Vue d’ensemble', settings: 'Administration', role: 'Permissions des rôles', roleDesc: 'Les permissions sont gérées centralement dans l’administration par un administrateur.', law: 'Loi n° 634 sur la copropriété en Turquie', governance: 'Gouvernance et audit de la résidence', apartments: 'Appartements', errors: 'Erreurs' },
  da: { start: 'Oversigt', settings: 'Administration', role: 'Rollebaserede rettigheder', roleDesc: 'Rettigheder administreres centralt af en administrator under Administration.', law: 'Lov nr. 634 om ejerlejligheder i Tyrkiet', governance: 'Kompleksstyring og revision', apartments: 'Lejligheder', errors: 'Fejl' },
  sv: { start: 'Översikt', settings: 'Administration', role: 'Rollbehörigheter', roleDesc: 'Behörigheter hanteras centralt av en administratör under Administration.', law: 'Turkiets lag nr 634 om ägarlägenheter', governance: 'Komplexstyrning och revision', apartments: 'Lägenheter', errors: 'Fel' },
  pl: { start: 'Przegląd', settings: 'Administracja', role: 'Uprawnienia ról', roleDesc: 'Uprawnienia są centralnie zarządzane przez administratora w Administracji.', law: 'Turecka ustawa nr 634 o własności lokali', governance: 'Zarządzanie kompleksem i audyt', apartments: 'Mieszkania', errors: 'Błędy' }
};
export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabSelect, currentLang }) => {
  const { hasPermission } = useAuth(); const t = translations[currentLang]; const s = startLabels[currentLang];
  const navItems = [
    { id: 'start_page' as TabType, label: s.start, icon: Home, visible: true },
    { id: 'complex' as TabType, label: t.navComplex, icon: Building2, visible: hasPermission('complex.view') },
    { id: 'buildings' as TabType, label: t.navBuildings, icon: Layers, visible: hasPermission('buildings.view') },
    { id: 'residents' as TabType, label: s.apartments, icon: Home, visible: hasPermission('residents.view') },
    { id: 'billing' as TabType, label: t.navBilling, icon: CreditCard, visible: hasPermission('billing.view') },
    { id: 'tasks' as TabType, label: t.navTasks, icon: Wrench, visible: hasPermission('tasks.view') },
    { id: 'documents' as TabType, label: t.navDocuments, icon: FileText, visible: hasPermission('documents.view') },
    { id: 'administration' as TabType, label: s.settings, icon: Settings, visible: hasPermission('administration.view') },
    { id: 'errors' as TabType, label: s.errors, icon: AlertTriangle, visible: currentTab === 'errors' || hasPermission('administration.view') },
    { id: 'guest_overview' as TabType, label: t.navPublicOverview, icon: Home, visible: true },
  ];
  return <aside id="main-sidebar" className="w-full md:w-64 shrink-0 bg-white md:min-h-[calc(100vh-5rem)] border-b md:border-b-0 md:border-r border-slate-200 p-4 flex flex-col justify-between"><div className="space-y-6"><div><div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">{t.appName}</div><nav className="mt-1 space-y-1">{navItems.filter(item => item.visible).map(item => { const Icon = item.icon; const isActive = currentTab === item.id; return <button key={item.id} id={`nav-${item.id}`} onClick={() => onTabSelect(item.id)} className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 text-left ${isActive ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} /><span className="truncate">{item.label}</span></button>; })}</nav></div><div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2"><div className="flex items-center space-x-1.5 font-bold text-slate-800"><Info className="w-3.5 h-3.5 text-teal-600" /><span>{s.role}</span></div><p className="text-[11px] leading-relaxed text-slate-500">{s.roleDesc}</p></div></div><div className="pt-4 border-t border-slate-100 text-[10px] text-slate-600 space-y-1"><p className="font-semibold text-slate-600">{s.law}</p><p>{s.governance}</p></div></aside>;
};
