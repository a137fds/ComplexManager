import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Plus,
  ArrowDownRight,
  Eye,
  X
} from 'lucide-react';
import { Resident, Invoice, Payment, UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

interface ResidentsViewProps {
  residents: Resident[];
  invoices: Invoice[];
  payments: Payment[];
  onRecordPayment: (payment: Partial<Payment>) => void;
  onOpenInvoiceModal: (invoice: Invoice) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const ResidentsView: React.FC<ResidentsViewProps> = ({
  residents,
  invoices,
  payments,
  onRecordPayment,
  onOpenInvoiceModal,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];
  const isResidentOnly = currentRole === 'resident';

  // For resident role, default to Alexander Ivanov (A-02) or Hakan Öztürk (A-01)
  const [selectedResidentId, setSelectedResidentId] = useState<string>(
    isResidentOnly ? 'res-102' : ''
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedDebtFilter, setSelectedDebtFilter] = useState<'all' | 'debt' | 'settled'>('all');

  // Payment Recording Modal State
  const [paymentModalResident, setPaymentModalResident] = useState<Resident | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(1400);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'credit_card' | 'cash'>('bank_transfer');
  const [paymentRef, setPaymentRef] = useState<string>('GAR-BANK-' + Math.floor(100000 + Math.random() * 900000));

  // Ledger detail modal
  const [viewingLedgerResident, setViewingLedgerResident] = useState<Resident | null>(
    isResidentOnly ? residents.find(r => r.id === 'res-102') || residents[0] : null
  );

  // Filtered residents list
  const filteredResidents = residents.filter((res) => {
    const matchesSearch =
      `${res.firstName} ${res.lastName} ${res.unitNumber} ${res.email} ${res.nationality}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesBlock = selectedBlock === 'all' || res.blockCode === selectedBlock;
    const matchesDebt =
      selectedDebtFilter === 'all'
        ? true
        : selectedDebtFilter === 'debt'
        ? res.outstandingBalance > 0
        : res.outstandingBalance === 0;

    return matchesSearch && matchesBlock && matchesDebt;
  });

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalResident) return;

    onRecordPayment({
      residentId: paymentModalResident.id,
      unitNumber: paymentModalResident.unitNumber,
      amount: Number(paymentAmount),
      currency: 'EUR',
      method: paymentMethod,
      payerName: `${paymentModalResident.firstName} ${paymentModalResident.lastName}`,
      referenceNo: paymentRef,
      paymentDate: new Date().toISOString().split('T')[0]
    });

    setPaymentModalResident(null);
  };

  const currentResidentView = isResidentOnly
    ? residents.find((r) => r.id === 'res-102') || residents[0]
    : viewingLedgerResident;

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isResidentOnly ? t.myResidentProfile : t.residentsTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isResidentOnly
              ? 'Apartment Unit statement, annual dues status, and official receipt downloads'
              : t.residentsSubtitle}
          </p>
        </div>

        {/* Aggregate KPI chips */}
        {!isResidentOnly && (
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-600 block">{t.totalUnitsLabel}</span>
              <span className="font-bold text-slate-900">{residents.length} Registered</span>
            </div>
            <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-emerald-700 block font-semibold">{t.totalPaid}</span>
              <span className="font-bold text-emerald-900">
                €{residents.reduce((acc, r) => acc + r.totalPaid, 0).toLocaleString()}
              </span>
            </div>
            <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-rose-700 block font-semibold">{t.outstandingDebt}</span>
              <span className="font-bold text-rose-900">
                €{residents.reduce((acc, r) => acc + r.outstandingBalance, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* If Resident Role is Active -> Show Resident Personal Portal Directly */}
      {isResidentOnly && currentResidentView && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                  {currentResidentView.unitNumber}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {currentResidentView.firstName} {currentResidentView.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentResidentView.blockCode} • Floor {currentResidentView.floor} • {currentResidentView.isOwner ? t.owner : t.tenant} ({currentResidentView.nationality})
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-medium">{currentResidentView.email}</span>
              </div>
            </div>

            {/* Resident Financial Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-600 block">{t.totalCharged}</span>
                <p className="text-2xl font-black text-slate-900 mt-1">€{currentResidentView.totalCharged.toLocaleString()}</p>
                <span className="text-[11px] text-slate-600">2025 & 2026 Aidat</span>
              </div>
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/70">
                <span className="text-xs font-semibold text-emerald-800 block">{t.totalPaid}</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">€{currentResidentView.totalPaid.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-700">Processed into Bank</span>
              </div>
              <div className={`p-4 rounded-xl border ${currentResidentView.outstandingBalance > 0 ? 'bg-rose-50/80 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                <span className="text-xs font-semibold block">{t.outstandingDebt}</span>
                <p className="text-2xl font-black mt-1">€{currentResidentView.outstandingBalance.toLocaleString()}</p>
                <span className="text-[11px] font-medium">
                  {currentResidentView.outstandingBalance > 0 ? 'Due 2026 Aidat Payment' : 'All obligations settled'}
                </span>
              </div>
            </div>
          </div>

          {/* Invoices and Payments Tabs for Resident */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Invoices List */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-base flex items-center">
                <FileText className="w-4 h-4 mr-2 text-teal-600" />
                {t.invoicesList}
              </h4>
              <div className="space-y-3">
                {invoices.filter(i => i.residentId === currentResidentView.id).map(inv => (
                  <div key={inv.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{inv.invoiceNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status === 'paid' ? t.paid : inv.status === 'partial' ? t.partial : inv.status === 'overdue' ? t.overdue : t.unpaid}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{inv.title}</p>
                      <span className="text-[11px] text-slate-600 font-mono">Due: {inv.dueDate}</span>
                    </div>
                    <div className="text-right space-y-1.5">
                      <div className="font-black text-sm text-slate-900">€{inv.amount}</div>
                      <button
                        onClick={() => onOpenInvoiceModal(inv)}
                        className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold inline-flex items-center transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        {t.view}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payments History */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-base flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-teal-600" />
                {t.paymentReceipt}
              </h4>
              <div className="space-y-3">
                {payments.filter(p => p.residentId === currentResidentView.id).length === 0 ? (
                  <p className="text-xs text-slate-600 py-4 text-center">No recorded payment receipts yet.</p>
                ) : (
                  payments.filter(p => p.residentId === currentResidentView.id).map(pay => (
                    <div key={pay.id} className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-emerald-950">{pay.receiptNumber}</div>
                        <p className="text-xs text-slate-600 mt-0.5">{pay.method.replace('_', ' ').toUpperCase()} • Ref: {pay.referenceNo}</p>
                        <span className="text-[11px] text-slate-600">{pay.paymentDate}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-emerald-900">+€{pay.amount}</div>
                        <span className="text-[10px] text-emerald-700 font-semibold">Verified</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Admin / Management Company Full Roster Table View */}
      {!isResidentOnly && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Blocks</option>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
              </select>

              <select
                value={selectedDebtFilter}
                onChange={(e) => setSelectedDebtFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Balances</option>
                <option value="debt">Has Outstanding Debt</option>
                <option value="settled">Settled (0.00)</option>
              </select>
            </div>
          </div>

          {/* Residents Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3.5">{t.unitNo}</th>
                    <th className="px-4 py-3.5">{t.residentName}</th>
                    <th className="px-4 py-3.5">{t.contactInfo}</th>
                    <th className="px-4 py-3.5">{t.ownership}</th>
                    <th className="px-4 py-3.5 text-right">{t.totalCharged}</th>
                    <th className="px-4 py-3.5 text-right">{t.totalPaid}</th>
                    <th className="px-4 py-3.5 text-right">{t.outstandingDebt}</th>
                    <th className="px-4 py-3.5 text-center">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResidents.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                        <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                          {res.unitNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{res.firstName} {res.lastName}</div>
                        <div className="text-[11px] text-slate-600">{res.nationality}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        <div className="text-slate-800 font-medium">{res.email}</div>
                        <div className="text-[11px] text-slate-600">{res.phone}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          res.isOwner ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {res.isOwner ? t.owner : t.tenant}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium text-slate-800">
                        €{res.totalCharged.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-700">
                        €{res.totalPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {res.outstandingBalance > 0 ? (
                          <span className="font-bold text-rose-700 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">
                            €{res.outstandingBalance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="font-bold text-slate-600 px-2 py-0.5 rounded-md bg-slate-100">
                            €0.00
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setViewingLedgerResident(res)}
                            title="View Resident Ledger & Invoices"
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {['admin', 'management_company'].includes(currentRole) && (
                            <button
                              onClick={() => {
                                setPaymentModalResident(res);
                                setPaymentAmount(res.outstandingBalance > 0 ? res.outstandingBalance : 1400);
                              }}
                              title="Record Payment"
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                            >
                              + Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModalResident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                {t.recordPayment} — Unit {paymentModalResident.unitNumber}
              </h3>
              <button
                onClick={() => setPaymentModalResident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 pt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block">Resident</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {paymentModalResident.firstName} {paymentModalResident.lastName} ({paymentModalResident.unitNumber})
                </p>
                <span className="text-slate-500 block mt-2">Outstanding Debt</span>
                <p className="font-black text-rose-700 text-base">€{paymentModalResident.outstandingBalance.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Amount (EUR)</label>
                <input
                  type="number"
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 font-bold font-mono border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.paymentMethod}</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="bank_transfer">Bank Wire (Garanti Bank TR IBAN)</option>
                  <option value="credit_card">POS / Credit Card</option>
                  <option value="cash">Cash to Management Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.referenceCode}</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentModalResident(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resident Ledger Inspector Modal */}
      {viewingLedgerResident && !isResidentOnly && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {t.residentLedger} — Unit {viewingLedgerResident.unitNumber}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {viewingLedgerResident.firstName} {viewingLedgerResident.lastName} • {viewingLedgerResident.email}
                </p>
              </div>
              <button
                onClick={() => setViewingLedgerResident(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.totalCharged}</span>
                  <span className="font-bold text-slate-900 text-sm">€{viewingLedgerResident.totalCharged}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                  <span className="text-[11px] text-emerald-800 font-semibold block">{t.totalPaid}</span>
                  <span className="font-bold text-emerald-950 text-sm">€{viewingLedgerResident.totalPaid}</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-center">
                  <span className="text-[11px] text-rose-800 font-semibold block">{t.outstandingDebt}</span>
                  <span className="font-bold text-rose-950 text-sm">€{viewingLedgerResident.outstandingBalance}</span>
                </div>
              </div>

              {/* Invoices for this resident */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Issued Invoices</h4>
                <div className="space-y-2">
                  {invoices.filter(i => i.residentId === viewingLedgerResident.id).map(inv => (
                    <div key={inv.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{inv.invoiceNumber}</span>
                        <p className="text-slate-500">{inv.title} • Due {inv.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">€{inv.amount}</span>
                        <button
                          onClick={() => onOpenInvoiceModal(inv)}
                          className="px-2 py-1 bg-teal-600 text-white rounded text-[11px] font-bold"
                        >
                          View PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments for this resident */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Payment History</h4>
                <div className="space-y-2">
                  {payments.filter(p => p.residentId === viewingLedgerResident.id).map(pay => (
                    <div key={pay.id} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-emerald-950">{pay.receiptNumber}</span>
                        <p className="text-slate-600">{pay.paymentDate} • Ref: {pay.referenceNo}</p>
                      </div>
                      <span className="font-bold text-emerald-900">+€{pay.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
