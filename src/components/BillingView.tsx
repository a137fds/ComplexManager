import React, { useState } from 'react';
import {
  CreditCard,
  Send,
  Plus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  Check,
  Building,
  Sparkles
} from 'lucide-react';
import {
  AnnualCharge,
  Invoice,
  Payment,
  Resident,
  UserRole,
  Language
} from '../types';
import { translations } from '../i18n/translations';

interface BillingViewProps {
  annualCharges: AnnualCharge[];
  invoices: Invoice[];
  payments: Payment[];
  residents: Resident[];
  onDefineAnnualCharge: (charge: Partial<AnnualCharge>) => void;
  onSendToAll: (chargeId: string) => void;
  onOpenInvoiceModal: (invoice: Invoice) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const BillingView: React.FC<BillingViewProps> = ({
  annualCharges,
  invoices,
  payments,
  residents,
  onDefineAnnualCharge,
  onSendToAll,
  onOpenInvoiceModal,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];
  const canManageCharges = ['admin', 'management_company', 'chairman'].includes(currentRole);

  const [isDefiningCharge, setIsDefiningCharge] = useState(false);
  const [newChargeYear, setNewChargeYear] = useState<number>(2027);
  const [newChargeAmount, setNewChargeAmount] = useState<number>(1500);
  const [newChargeTitle, setNewChargeTitle] = useState<string>('2027 General Maintenance Dues (Aidat)');
  const [newChargeDesc, setNewChargeDesc] = useState<string>('Approved preliminary budget for 2027 operations.');

  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'partial' | 'overdue'>('all');
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);

  // Financial aggregates
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalReceivables = totalBilled - totalPaid;
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const handleCreateCharge = (e: React.FormEvent) => {
    e.preventDefault();
    onDefineAnnualCharge({
      year: Number(newChargeYear),
      amount: Number(newChargeAmount),
      currency: 'EUR',
      title: newChargeTitle,
      description: newChargeDesc,
      createdBy: currentRole === 'management_company' ? 'Alanya Site Management Ltd. (MC)' : 'Board Administration'
    });
    setIsDefiningCharge(false);
  };

  const handleSendToAllTrigger = (chargeId: string) => {
    onSendToAll(chargeId);
    setBatchSuccessMessage(t.sendToAllSuccess);
    setTimeout(() => setBatchSuccessMessage(null), 6000);
  };

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return t.paid;
      case 'unpaid': return t.unpaid;
      case 'partial': return t.partial;
      case 'overdue': return t.overdue;
      default: return status;
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter === 'all') return true;
    return inv.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Aggregate KPI Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.billingTitle}</h2>
            <p className="text-xs text-slate-500 mt-1">{t.billingSubtitle}</p>
          </div>
          {canManageCharges && (
            <button
              id="define-charge-btn"
              onClick={() => setIsDefiningCharge(true)}
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {t.defineAnnualCharge}
            </button>
          )}
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 block">Total Dues Invoiced</span>
            <p className="text-2xl font-black text-slate-900 mt-1">€{totalBilled.toLocaleString()}</p>
            <span className="text-[11px] text-slate-600">{invoices.length} Individual Invoices</span>
          </div>

          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 block">{t.totalCollected}</span>
            <p className="text-2xl font-black text-emerald-950 mt-1">€{totalPaid.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-700 font-semibold">{payments.length} Verified Bank Payments</span>
          </div>

          <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200">
            <span className="text-xs font-semibold text-rose-800 block">{t.totalReceivables}</span>
            <p className="text-2xl font-black text-rose-950 mt-1">€{totalReceivables.toLocaleString()}</p>
            <span className="text-[11px] text-rose-700 font-semibold">Outstanding Balance</span>
          </div>

          <div className="p-4 bg-teal-50/80 rounded-xl border border-teal-200">
            <span className="text-xs font-semibold text-teal-800 block">{t.collectionRate}</span>
            <p className="text-2xl font-black text-teal-950 mt-1">{collectionRate}%</p>
            <div className="w-full bg-teal-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: `${Math.min(collectionRate, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {batchSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between animate-fade-in text-xs font-semibold shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{batchSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Annual Charges Manager (SPEC 6.1 & 6.2) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-teal-600" />
            {t.annualCharges}
          </h3>
          <span className="text-xs text-slate-500 font-medium">Batch Billing Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {annualCharges.map((charge) => (
            <div
              key={charge.id}
              className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 font-black text-xs rounded-lg">
                    Year {charge.year}
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    €{charge.amount} <span className="text-xs text-slate-500 font-normal">/ unit</span>
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-3">{charge.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{charge.description}</p>
                <div className="mt-3 text-[11px] text-slate-600 flex justify-between font-medium">
                  <span>Created: {charge.createdAt}</span>
                  <span>By: {charge.createdBy}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Distributed to 48 Units
                </span>

                {canManageCharges && (
                  <button
                    id={`send-to-all-${charge.id}`}
                    onClick={() => handleSendToAllTrigger(charge.id)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-xs inline-flex items-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {t.sendToAll}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices List Table (SPEC 6.3 & 6.4) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t.invoicesList}</h3>
            <p className="text-xs text-slate-500">Official individual resident tax & site dues invoices</p>
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'paid', 'unpaid', 'partial'] as const).map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(statusKey)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  statusFilter === statusKey
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {statusKey === 'all' ? t.all : getStatusLabel(statusKey as Invoice['status'])}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">{t.invoiceNo}</th>
                <th className="px-4 py-3">{t.unitNo}</th>
                <th className="px-4 py-3">{t.residentName}</th>
                <th className="px-4 py-3">{t.yearLabel}</th>
                <th className="px-4 py-3 text-right">{t.amountLabel}</th>
                <th className="px-4 py-3">{t.dueDate}</th>
                <th className="px-4 py-3 text-center">{t.status}</th>
                <th className="px-4 py-3 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{inv.unitNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{inv.residentName}</td>
                  <td className="px-4 py-3 font-bold text-teal-800">{inv.year}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">€{inv.amount}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{inv.dueDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {getStatusLabel(inv.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onOpenInvoiceModal(inv)}
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-bold text-[11px] inline-flex items-center transition-colors border border-teal-200"
                    >
                      <Eye className="w-3 h-3 mr-1 text-teal-600" />
                      PDF View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Define Annual Charge Modal */}
      {isDefiningCharge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-200">
              {t.defineAnnualCharge}
            </h3>
            <form onSubmit={handleCreateCharge} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.yearLabel}</label>
                  <input
                    type="number"
                    min="2020"
                    max="2035"
                    value={newChargeYear}
                    onChange={(e) => setNewChargeYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.amountLabel} (EUR)</label>
                  <input
                    type="number"
                    min="100"
                    value={newChargeAmount}
                    onChange={(e) => setNewChargeAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Purpose</label>
                <input
                  type="text"
                  value={newChargeTitle}
                  onChange={(e) => setNewChargeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={newChargeDesc}
                  onChange={(e) => setNewChargeDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDefiningCharge(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
