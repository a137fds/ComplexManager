import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Clock,
  Search,
  Filter,
  History,
  Sparkles
} from 'lucide-react';
import { UserRole, Language, AuditLog } from '../types';
import { translations } from '../i18n/translations';

interface AdministrationViewProps {
  auditLogs: AuditLog[];
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentLang: Language;
}

interface PermissionRow {
  capability: string;
  admin: boolean;
  management_company: boolean;
  chairman: boolean;
  board_member: boolean;
  financial_controller: boolean;
  site_staff: boolean;
  resident: boolean;
  guest: boolean;
}

const permissionMatrix: PermissionRow[] = [
  {
    capability: 'View Complex & Public Info',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: true,
    financial_controller: true,
    site_staff: true,
    resident: true,
    guest: true
  },
  {
    capability: 'Edit Site Legal & Tax Registry',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: false,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'Manage Buildings & Units',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: false,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'View Full Resident Debt Roster',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: true,
    financial_controller: true,
    site_staff: false,
    resident: false, // only self
    guest: false
  },
  {
    capability: 'Define Annual Dues & "Send to All"',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: false,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'Record Bank Payments / Receipts',
    admin: true,
    management_company: true,
    chairman: false,
    board_member: false,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'Submit Maintenance Tasks',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: true,
    financial_controller: true,
    site_staff: true,
    resident: true,
    guest: false
  },
  {
    capability: 'Manage Tenders (> €500)',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: true,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'Execute Financial Controller Checklist',
    admin: true,
    management_company: false,
    chairman: false,
    board_member: false,
    financial_controller: true,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'Board Voting & Final Task Approval',
    admin: true,
    management_company: false,
    chairman: true,
    board_member: true,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'Upload Documents',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: true,
    financial_controller: true,
    site_staff: true,
    resident: false,
    guest: false
  },
  {
    capability: 'Soft-Delete Documents (Archival)',
    admin: true,
    management_company: true,
    chairman: true,
    board_member: false,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
  {
    capability: 'View Soft-Deleted Items & Permanent Purge',
    admin: true,
    management_company: false, // strictly forbidden in SPEC 3.2
    chairman: false,
    board_member: false,
    financial_controller: false,
    site_staff: false,
    resident: false,
    guest: false
  },
];

export const AdministrationView: React.FC<AdministrationViewProps> = ({
  auditLogs,
  currentRole,
  onRoleChange,
  currentLang
}) => {
  const t = translations[currentLang];
  const [logFilter, setLogFilter] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    `${log.userName} ${log.action} ${log.details} ${log.userRole}`
      .toLowerCase()
      .includes(logFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.adminTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.adminSubtitle}</p>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200">
          KMK Compliance Mode
        </span>
      </div>

      {/* Role Permission Matrix Card (SPEC Section 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-teal-600" />
              {t.rolePermissionMatrix}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Granular functional permissions defined according to Turkish Condominium Law (KMK)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Governance Capability</th>
                <th className="px-2 py-3 text-center">Admin</th>
                <th className="px-2 py-3 text-center">Mgt. Co.</th>
                <th className="px-2 py-3 text-center">Chairman</th>
                <th className="px-2 py-3 text-center">Board</th>
                <th className="px-2 py-3 text-center">Fin. Ctrl</th>
                <th className="px-2 py-3 text-center">Staff</th>
                <th className="px-2 py-3 text-center">Resident</th>
                <th className="px-2 py-3 text-center">Guest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{row.capability}</td>
                  
                  {['admin', 'management_company', 'chairman', 'board_member', 'financial_controller', 'site_staff', 'resident', 'guest'].map((r) => {
                    const hasPerm = (row as any)[r];
                    const isCurrent = currentRole === r;
                    return (
                      <td
                        key={r}
                        className={`px-2 py-2.5 text-center ${
                          isCurrent ? 'bg-teal-50/70 font-bold' : ''
                        }`}
                      >
                        {hasPerm ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Trail (SPEC 3.2 & TODO) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center">
              <History className="w-5 h-5 mr-2 text-teal-600" />
              {t.auditTrail}
            </h3>
            <p className="text-xs text-slate-500">
              Immutable ledger of critical governance, deletion, payment, and approval actions
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.userRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                    log.userRole === 'management_company' ? 'bg-blue-100 text-blue-800' :
                    log.userRole === 'financial_controller' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {log.userRole.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600">{log.details}</p>
              </div>

              <div className="text-right text-[11px] text-slate-600 sm:shrink-0 font-mono">
                <p className="font-semibold text-slate-700">{log.userName}</p>
                <p>{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
