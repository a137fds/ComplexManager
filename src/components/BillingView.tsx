import React, { useEffect, useState } from 'react';
import { CreditCard, Send, Plus, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { AnnualCharge, Invoice, Payment, UserRole, Language } from '../types';
import { translations } from '../i18n/translations';
import { supabase } from '../lib/supabase';

interface BillingViewProps { annualCharges: AnnualCharge[]; invoices: Invoice[]; payments: Payment[]; residents?: any[]; onDefineAnnualCharge: (charge: Partial<AnnualCharge>) => void; onSendToAll: (chargeId: string) => void; onOpenInvoiceModal: (invoice: Invoice) => void; currentRole: UserRole; currentLang: Language; }

export const BillingView: React.FC<BillingViewProps> = ({ annualCharges, payments, onDefineAnnualCharge, onOpenInvoiceModal, currentRole, currentLang }) => {
  const t = translations[currentLang];
  const canManageCharges = ['admin', 'management_company', 'chairman'].includes(currentRole);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [apartmentCount, setApartmentCount] = useState(0);
  const [isDefiningCharge, setIsDefiningCharge] = useState(false);
  const [newChargeYear, setNewChargeYear] = useState(2027);
  const [newChargeAmount, setNewChargeAmount] = useState(1500);
  const [newChargeTitle, setNewChargeTitle] = useState('2027 General Maintenance Dues (Aidat)');
  const [newChargeDesc, setNewChargeDesc] = useState('Approved preliminary budget for 2027 operations.');
  const [statusFilter, setStatusFilter] = useState<'all'|'paid'|'unpaid'|'partial'|'overdue'>('all');
  const [message, setMessage] = useState<string | null>(null);

  const loadBilling = async () => {
    const [{ data: apartments }, { data: rows, error }] = await Promise.all([
      supabase.from('apartments').select('id'),
      supabase.from('invoices').select('id,invoice_number,apartment_id,billing_year,amount,currency,status,issue_date,due_date,title,description,paid_amount,payer_names').order('created_at', { ascending: false })
    ]);
    setApartmentCount(apartments?.length || 0);
    if (error) { console.error('Failed to load invoices:', error); return; }
    setInvoices((rows || []).map((r: any) => ({
      id: String(r.id), invoiceNumber: r.invoice_number || `INV-${r.billing_year}-${r.id}`, apartmentId: r.apartment_id ?? undefined,
      payerNames: r.payer_names || [], unitNumber: '', blockCode: '', year: r.billing_year, title: r.title || '', amount: Number(r.amount), currency: r.currency || 'EUR',
      issueDate: r.issue_date || String(r.created_at || '').slice(0,10), dueDate: r.due_date || '', status: r.status || 'unpaid', paidAmount: Number(r.paid_amount || 0), pdfGenerated: Boolean(r.document_path), description: r.description
    })));
  };
  useEffect(() => { void loadBilling(); }, []);

  const totalBilled = invoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const collectionRate = totalBilled ? Math.round(totalPaid / totalBilled * 100) : 0;

  const sendToAll = async (charge: AnnualCharge) => {
    if (!canManageCharges) return;
    const { data: apartments, error } = await supabase.from('apartments').select('id,apartment_number,building_id,apartment_owners(user_id,user_profiles(first_name,last_name)),invoice_recipients(user_id)');
    if (error) { setMessage(error.message); return; }
    const existing = new Set(invoices.filter(i => i.year === charge.year).map(i => i.apartmentId));
    const rows = (apartments || []).filter((a: any) => !existing.has(a.id)).map((a: any) => {
      const payerNames = (a.apartment_owners || []).map((o: any) => `${o.user_profiles?.first_name || ''} ${o.user_profiles?.last_name || ''}`.trim()).filter(Boolean);
      return { invoice_number: `INV-${charge.year}-${a.id}`, apartment_id: a.id, billing_year: charge.year, amount: charge.amount, currency: charge.currency, status: 'unpaid', issue_date: new Date().toISOString().slice(0,10), due_date: `${charge.year}-03-31`, title: charge.title, description: charge.description, paid_amount: 0, payer_names: payerNames };
    });
    if (!rows.length) { setMessage(apartmentCount ? 'All apartments already have an invoice for this year.' : 'No apartments are configured yet. Add apartments before issuing invoices.'); return; }
    const { error: insertError } = await supabase.from('invoices').insert(rows);
    if (insertError) { setMessage(insertError.message); return; }
    await loadBilling();
    setMessage(`Created ${rows.length} invoice(s), one per apartment.`);
    setTimeout(() => setMessage(null), 6000);
  };

  const filtered = statusFilter === 'all' ? invoices : invoices.filter(i => i.status === statusFilter);
  const label = (s: Invoice['status']) => s === 'paid' ? t.paid : s === 'unpaid' ? t.unpaid : s === 'partial' ? t.partial : t.overdue;

  return <div className="space-y-6">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-900">{t.billingTitle}</h2><p className="text-xs text-slate-500 mt-1">Invoices are issued to apartments, not to users.</p></div>{canManageCharges && <button onClick={() => setIsDefiningCharge(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"><Plus className="inline w-4 h-4 mr-1" />{t.defineAnnualCharge}</button>}</div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4"><div className="p-4 bg-slate-50 rounded-xl"><span className="text-xs font-semibold text-slate-500">Apartments</span><p className="text-2xl font-black">{apartmentCount}</p></div><div className="p-4 bg-slate-50 rounded-xl"><span className="text-xs font-semibold text-slate-500">Total Invoiced</span><p className="text-2xl font-black">€{totalBilled.toLocaleString()}</p></div><div className="p-4 bg-slate-50 rounded-xl"><span className="text-xs font-semibold text-slate-500">{t.totalCollected}</span><p className="text-2xl font-black">€{totalPaid.toLocaleString()}</p></div><div className="p-4 bg-slate-50 rounded-xl"><span className="text-xs font-semibold text-slate-500">{t.collectionRate}</span><p className="text-2xl font-black">{collectionRate}%</p></div></div>
    </div>
    {message && <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold"><CheckCircle2 className="inline w-4 h-4 mr-2" />{message}</div>}
    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4"><h3 className="font-bold flex items-center"><Sparkles className="w-4 h-4 mr-2 text-teal-600" />{t.annualCharges}</h3>{annualCharges.map(charge => <div key={charge.id} className="p-5 rounded-2xl border flex items-center justify-between gap-4"><div><span className="text-xs font-black">Year {charge.year}</span><h4 className="font-bold mt-2">{charge.title}</h4><p className="text-xs text-slate-500">€{charge.amount} per apartment</p></div>{canManageCharges && <button onClick={() => void sendToAll(charge)} className="px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold"><Send className="inline w-3.5 h-3.5 mr-1" />{t.sendToAll}</button>}</div>)}</div>
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-bold">{t.invoicesList}</h3><div className="flex gap-1">{(['all','paid','unpaid','partial'] as const).map(s => <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusFilter===s?'bg-teal-700 text-white':'bg-slate-100 text-slate-600'}`}>{s==='all'?t.all:label(s as Invoice['status'])}</button>)}</div></div><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50"><tr><th className="px-4 py-3">{t.invoiceNo}</th><th className="px-4 py-3">Apartment</th><th className="px-4 py-3">Payer(s)</th><th className="px-4 py-3">{t.amountLabel}</th><th className="px-4 py-3">{t.status}</th><th className="px-4 py-3">{t.actions}</th></tr></thead><tbody className="divide-y">{filtered.map(inv => <tr key={inv.id}><td className="px-4 py-3 font-mono font-bold">{inv.invoiceNumber}</td><td className="px-4 py-3 font-bold">{inv.unitNumber || inv.apartmentId || '—'}</td><td className="px-4 py-3">{(inv.payerNames || []).join(', ') || '—'}</td><td className="px-4 py-3 font-bold">€{inv.amount}</td><td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-slate-100 font-bold">{label(inv.status)}</span></td><td className="px-4 py-3"><button onClick={() => onOpenInvoiceModal(inv)} className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg font-bold text-[11px]"><Eye className="inline w-3 h-3 mr-1" />PDF View</button></td></tr>)}</tbody></table></div></div>
    {isDefiningCharge && <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"><form onSubmit={e => {e.preventDefault();onDefineAnnualCharge({year:newChargeYear,amount:newChargeAmount,currency:'EUR',title:newChargeTitle,description:newChargeDesc,createdBy:currentRole});setIsDefiningCharge(false);}} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4"><h3 className="font-bold">{t.defineAnnualCharge}</h3><input type="number" value={newChargeYear} onChange={e=>setNewChargeYear(Number(e.target.value))} className="w-full border rounded-lg p-2"/><input type="number" value={newChargeAmount} onChange={e=>setNewChargeAmount(Number(e.target.value))} className="w-full border rounded-lg p-2"/><input value={newChargeTitle} onChange={e=>setNewChargeTitle(e.target.value)} className="w-full border rounded-lg p-2"/><textarea value={newChargeDesc} onChange={e=>setNewChargeDesc(e.target.value)} className="w-full border rounded-lg p-2"/><div className="flex justify-end gap-2"><button type="button" onClick={()=>setIsDefiningCharge(false)} className="px-3 py-2 border rounded-lg">{t.cancel}</button><button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold">{t.save}</button></div></form></div>}
  </div>;
};