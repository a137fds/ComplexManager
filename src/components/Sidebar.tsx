import React from 'react';
import {
  Building2,
  Layers,
  Database,
  Users,
  CreditCard,
  Wrench,
  FileText,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

export type TabType =
  | 'database_crud'
  | 'complex'
  | 'buildings'
  | 'residents'
  | 'billing'
  | 'tasks'
  | 'documents'
  | 'administration'
  | 'guest_overview';

interface SidebarProps {
  currentTab: TabType;
  onTabSelect: (tab: TabType) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabSelect,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];

  // Role-based navigation visibility
  const navItems = [
    {
      id: 'database_crud' as TabType,
      label: 'Cloud SQL (CRUD)',
      icon: Database,
      visible: true
    },
    {
      id: 'complex' as TabType,
      label: t.navComplex,
      icon: Building2,
      visible: currentRole !== 'guest'
    },
    {
      id: 'buildings' as TabType,
      label: t.navBuildings,
      icon: Layers,
      visible: currentRole !== 'guest'
    },
    {
      id: 'residents' as TabType,
      label: t.navResidents,
      icon: Users,
      visible: currentRole !== 'guest'
    },
    {
      id: 'billing' as TabType,
      label: t.navBilling,
      icon: CreditCard,
      visible: ['admin', 'management_company', 'chairman', 'board_member', 'financial_controller', 'resident'].includes(currentRole)
    },
    {
      id: 'tasks' as TabType,
      label: t.navTasks,
      icon: Wrench,
      visible: ['admin', 'management_company', 'chairman', 'board_member', 'financial_controller', 'site_staff', 'resident'].includes(currentRole)
    },
    {
      id: 'documents' as TabType,
      label: t.navDocuments,
      icon: FileText,
      visible: currentRole !== 'guest'
    },
    {
      id: 'administration' as TabType,
      label: t.navAdministration,
      icon: ShieldAlert,
      visible: ['admin', 'chairman', 'board_member', 'financial_controller'].includes(currentRole)
    },
    {
      id: 'guest_overview' as TabType,
      label: t.navPublicOverview,
      icon: Sparkles,
      visible: true
    }
  ];

  return (
    <aside id="main-sidebar" className="w-full md:w-64 shrink-0 bg-white md:min-h-[calc(100vh-5rem)] border-b md:border-b-0 md:border-r border-slate-200 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {t.appName}
          </div>
          <nav className="mt-1 space-y-1">
            {navItems.filter(item => item.visible).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onTabSelect(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Role Notice Card */}
        <div className="rounded-xl p-3.5 bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800">
            <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Role Permissions</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            {currentRole === 'management_company' && 'Management Company operates the complex under Board supervision. Deletions are soft-archived for Admin verification.'}
            {currentRole === 'financial_controller' && 'Financial Controller audits tenders, invoices, and ensures pricing reasonableness before payouts.'}
            {currentRole === 'chairman' && 'Board Chairman exercises executive oversight and confirms contractor task proposals.'}
            {currentRole === 'admin' && 'Admin has full visibility including soft-deleted files marked by the Management Company.'}
            {currentRole === 'resident' && 'Resident access displays your apartment dues statement, payment history and site documents.'}
            {currentRole === 'site_staff' && 'Site staff (Kapıcı) has access to block tasks, maintenance logs and resident assistance.'}
            {currentRole === 'guest' && 'Public guest view provides complex media, house rules, and site office contacts.'}
            {currentRole === 'board_member' && 'Board members participate in procurement decisions and monitor financial health.'}
          </p>
        </div>
      </div>

      {/* Turkish KMK Legal Reference Footnote */}
      <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-600 space-y-1">
        <p className="font-semibold text-slate-600">634 Sayılı Kat Mülkiyeti Kanunu</p>
        <p>Complex Governance & Audit Standard</p>
      </div>
    </aside>
  );
};
