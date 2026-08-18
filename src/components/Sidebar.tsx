import React from 'react';
import { Building2, Layers, Database, Users, CreditCard, Wrench, FileText, Sparkles, Settings, Info } from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

export type TabType = 'database_crud' | 'complex' | 'buildings' | 'residents' | 'billing' | 'tasks' | 'documents' | 'administration' | 'guest_overview';
interface SidebarProps { currentTab: TabType; onTabSelect: (tab: TabType) => void; currentRole: UserRole; currentLang: Language; }

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabSelect, currentRole, currentLang }) => {
  const t = translations[currentLang];
  const labels = {
    en: { complex: 'Complex (Site)', database: 'Cloud SQL (CRUD)', settings: 'Administration', role: 'Role Permissions', roleDesc: 'Permissions are managed centrally in Administration by an administrator.', law: '634 Sayılı Kat Mülkiyeti Kanunu', governance: 'Complex Governance & Audit Standard' },
    ru: { complex: 'Жилой комплекс (Site)', database: 'Cloud SQL (CRUD)', settings: 'Администрирование', role: 'Права ролей', roleDesc: 'Права доступа централизованно управляются администратором в разделе администрирования.', law: 'Закон Турции №634 о кондоминиумах', governance: 'Управление комплексом и аудит' },
    tr: { complex: 'Konut kompleksi (Site)', database: 'Cloud SQL (CRUD)', settings: 'Yönetim', role: 'Rol Yetkileri', roleDesc: 'Yetkiler yönetici tarafından Yönetim bölümünde merkezi olarak yönetilir.', law: '634 Sayılı Kat Mülkiyeti Kanunu', governance: 'Kompleks Yönetimi ve Denetim Standardı' },
    fr: { complex: 'Résidence (Site)', database: 'Cloud SQL (CRUD)', settings: 'Administration', role: 'Permissions des rôles', roleDesc: 'Les permissions sont gérées centralement dans l’administration par un administrateur.', law: 'Loi n° 634 sur la copropriété en Turquie', governance: 'Gouvernance et audit de la résidence' },
    da: { complex: 'Boligkompleks (Site)', database: 'Cloud SQL (CRUD)', settings: 'Administration', role: 'Rollebaserede rettigheder', roleDesc: 'Rettigheder administreres centralt af en administrator under Administration.', law: 'Lov nr. 634 om ejerlejligheder i Tyrkiet', governance: 'Kompleksstyring og revision' },
    sv: { complex: 'Bostadskomplex (Site)', database: 'Cloud SQL (CRUD)', settings: 'Administration', role: 'Rollbehörigheter', roleDesc: 'Behörigheter hanteras centralt av en administratör under Administration.', law: 'Turkiets lag nr 634 om ägarlägenheter', governance: 'Komplexstyrning och revision' },
    pl: { complex: 'Kompleks (Site)', database: 'Cloud SQL (CRUD)', settings: 'Administracja', role: 'Uprawnienia ról', roleDesc: 'Uprawnienia są centralnie zarządzane przez administratora w Administracji.', law: 'Turecka ustawa nr 634 o własności lokali', governance: 'Zarządzanie kompleksem i audyt' }
  }[currentLang];
  const navItems = [
    { id: 'database_crud' as TabType, label: labels.database, icon: Database, visible: true },
    { id: 'complex' as TabType, label: labels.complex, icon: Building2, visible: currentRole !== 'guest' },
    { id: 'buildings' as TabType, label: t.navBuildings, icon: Layers, visible: currentRole !== 'guest' },
    { id: 'residents' as TabType, label: t.navResidents, icon: Users, visible: currentRole !== 'guest' },
    { id: 'billing' as TabType, label: t.navBilling, icon: CreditCard, visible: ['admin','management_company','chairman','board_member','financial_controller','resident'].includes(currentRole) },
    { id: 'tasks' as TabType, label: t.navTasks, icon: Wrench, visible: ['admin','management_company','chairman','board_member','financial_controller','site_staff','resident'].includes(currentRole) },
    { id: 'documents' as TabType, label: t.navDocuments, icon: FileText, visible: currentRole !== 'guest' },
    { id: 'administration' as TabType, label: labels.settings, icon: Settings, visible: currentRole === 'admin' },
    { id: 'guest_overview' as TabType, label: t.navPublicOverview, icon: Sparkles, visible: true },
  ];
  return <aside id="main-sidebar" className="w-full md:w-64 shrink-0 bg-white md:min-h-[calc(100vh-5rem)] border-b md:border-b-0 md:border-r border-slate-200 p-4 flex flex-col justify-between"><div className="space-y-6"><div><div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">{t.appName}</div><nav className="mt-1 space-y-1">{navItems.filter(item => item.visible).map(item => { const Icon = item.icon; const isActive = currentTab === item.id; return <button key={item.id} id={`nav-${item.id}`} onClick={() => onTabSelect(item.id)} className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 text-left ${isActive ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} /><span className="truncate">{item.label}</span></button>; })}</nav></div><div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2"><div className="flex items-center space-x-1.5 font-bold text-slate-800"><Info className="w-3.5 h-3.5 text-teal-600" /><span>{labels.role}</span></div><p className="text-[11px] leading-relaxed text-slate-500">{labels.roleDesc}</p></div></div><div className="pt-4 border-t border-slate-100 text-[10px] text-slate-600 space-y-1"><p className="font-semibold text-slate-600">{labels.law}</p><p>{labels.governance}</p></div></aside>;
};
