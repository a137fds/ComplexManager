import React from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  QrCode,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { Invoice, ComplexInfo, Language } from '../types';
import { translations } from '../i18n/translations';

interface InvoiceModalProps {
  invoice: Invoice;
  complex: ComplexInfo;
  onClose: () => void;
  currentLang: Language;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  complex,
  onClose,
  currentLang
}) => {
  const t = translations[currentLang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800">
        
        {/* Modal Top Action Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-200 flex items-center justify-between no-print z-10">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-900">
              {t.paymentReceipt || 'Invoice / Receipt'}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
              invoice.status === 'partial' ? 'bg-amber-100 text-amber-800' :
              'bg-rose-100 text-rose-800'
            }`}>
              {invoice.status === 'paid' ? t.paid : invoice.status === 'partial' ? t.partial : invoice.status === 'overdue' ? t.overdue : t.unpaid}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold inline-flex items-center shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              {t.print || 'Print'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-6 text-sm" id="printable-invoice">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-teal-800">
                <Building2 className="w-5 h-5" />
                <span className="font-extrabold text-base uppercase tracking-tight">
                  {complex.nativeName} YÖNETİCİLİĞİ
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {complex.address}, {complex.district} / {complex.city}
              </p>
              <p className="text-xs text-slate-600">
                Vergi Dairesi: <strong>{complex.taxOffice}</strong> | VKN: <strong>{complex.taxNumber}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-0.5 sm:shrink-0">
              <span className="text-xs uppercase font-bold text-slate-600 block">Aidat Bildirim Belgesi</span>
              <p className="text-lg font-black font-mono text-slate-950">{invoice.invoiceNumber}</p>
              <p className="text-xs text-slate-600">Issue Date: <strong>{invoice.issueDate}</strong></p>
              <p className="text-xs text-rose-700 font-bold">Due Date: <strong>{invoice.dueDate}</strong></p>
            </div>
          </div>

          {/* Resident Details Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-600 font-semibold block uppercase text-[10px]">Bağımsız Bölüm & Malik</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{invoice.residentName}</p>
              <p className="text-slate-600 mt-0.5">Apartment Unit: <strong className="text-slate-900">{invoice.unitNumber}</strong></p>
            </div>
            <div>
              <span className="text-slate-600 font-semibold block uppercase text-[10px]">Aidat Dönemi & Kapsam</span>
              <p className="text-sm font-bold text-teal-900 mt-0.5">{invoice.title}</p>
              <p className="text-slate-600 mt-0.5">{invoice.description}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Item Description</th>
                  <th className="px-4 py-2.5 text-center">Period</th>
                  <th className="px-4 py-2.5 text-center">KMK Status</th>
                  <th className="px-4 py-2.5 text-right">Amount (EUR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.lineItems || [
                  { description: invoice.description || 'Annual Maintenance / KMK Aidat Fee', amount: invoice.amount }
                ]).map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.description}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{invoice.year}</td>
                    <td className="px-4 py-3 text-center text-slate-600">634 KMK Aidat (Muaf)</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">€{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-xs uppercase">
                    Toplam Ödenecek Tutar / Total Due:
                  </td>
                  <td className="px-4 py-3 text-right text-base text-teal-950 font-black">
                    €{invoice.amount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Bank Payment Remittance Info */}
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-teal-900 font-bold">
              <Landmark className="w-4 h-4" />
              <span>Resmi Site Banka Hesap Bilgileri (Remittance Details)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Bank & Account Name:</span>
                <span className="font-semibold text-slate-800">{complex.bankName} — {complex.nativeName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">SWIFT / BIC Code:</span>
                <span className="font-mono font-bold text-slate-800">{complex.swift}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Site IBAN:</span>
                <span className="font-mono font-black text-xs text-teal-950 select-all">{complex.iban}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Payment Description / Reference Note:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-teal-300">
                  {invoice.unitNumber} - {invoice.residentName} - Aidat {invoice.year}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Footnote & Seal */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-4">
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-700">634 Sayılı Kat Mülkiyeti Kanunu Madde 20 Uyarınca Düzenlenmiştir.</p>
              <p>Late payments incur a statutory legal interest rate of 5% per month pursuant to KMK Article 20/c.</p>
            </div>
            <div className="text-center shrink-0 border border-slate-300 rounded-lg p-2 bg-slate-50 font-serif">
              <div className="font-bold text-slate-700 uppercase tracking-widest text-[9px]">YÖNETİM ONAYI</div>
              <div className="text-teal-900 font-bold text-xs mt-0.5">E-İMZALI / MÜHÜRLÜ</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
