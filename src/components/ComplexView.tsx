import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Landmark,
  FileCheck2,
  Calendar,
  Layers,
  Home,
  Phone,
  Shield,
  Edit3,
  Check,
  X,
  Image as ImageIcon,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { ComplexInfo, UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

interface ComplexViewProps {
  complex: ComplexInfo;
  onUpdateComplex: (updated: ComplexInfo) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const ComplexView: React.FC<ComplexViewProps> = ({
  complex,
  onUpdateComplex,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];
  const canEdit = ['admin', 'management_company', 'chairman'].includes(currentRole);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ComplexInfo>(complex);
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateComplex(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Identity Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img
            src={complex.representativePhoto}
            alt={complex.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 p-6 sm:p-8 md:p-10 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide text-teal-200 border border-white/10">
              <Landmark className="w-3.5 h-3.5" />
              <span>Resmi Site Kaydı • {complex.nativeName}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {complex.name}
            </h2>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-200">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-teal-400 shrink-0" />
                {complex.address}, {complex.district} / {complex.city}, {complex.country}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-teal-400 shrink-0" />
                {t.builtIn}: {complex.constructionYear}
              </span>
            </div>
            <p className="text-sm text-slate-300 pt-2 leading-relaxed">
              {complex.description[currentLang] || complex.description.en}
            </p>
          </div>

          {canEdit && (
            <div className="shrink-0">
              <button
                id="edit-complex-btn"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {t.editComplexDetails}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Core Specification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Structural Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-3 text-teal-700">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200">
              <Layers className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t.totalBlocksLabel} & {t.totalUnitsLabel}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-600 font-semibold">{t.totalBlocksLabel}</span>
              <p className="text-2xl font-black text-slate-900">{complex.totalBlocks} Blocks</p>
              <span className="text-[11px] text-teal-700 font-medium">Block A, B, C</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-600 font-semibold">{t.totalUnitsLabel}</span>
              <p className="text-2xl font-black text-slate-900">{complex.totalUnits} Units</p>
              <span className="text-[11px] text-teal-700 font-medium">48 Independent Units</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Tax & Legal Registry */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-3 text-teal-700">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200">
              <FileCheck2 className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t.taxInfo}</h3>
          </div>
          <div className="space-y-2 pt-1 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Vergi Numarası (VKN):</span>
              <span className="font-mono font-bold text-slate-900">{complex.taxNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Vergi Dairesi:</span>
              <span className="font-semibold text-slate-900">{complex.taxOffice}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 font-medium">Posta Kodu:</span>
              <span className="font-semibold text-slate-900">{complex.postalCode} Alanya</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Bank Account (Site IBAN) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-3 text-teal-700">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200">
              <Landmark className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t.bankAccountInfo}</h3>
          </div>
          <div className="p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl space-y-1.5">
            <div className="text-xs font-semibold text-teal-900">{complex.bankName}</div>
            <div className="font-mono text-xs sm:text-sm font-bold text-teal-950 tracking-wide select-all bg-white p-2 rounded-lg border border-teal-300">
              {complex.iban}
            </div>
            <div className="text-[11px] text-teal-800 flex justify-between font-mono">
              <span>SWIFT / BIC: <strong>{complex.swift}</strong></span>
              <span>Account: <strong>Günbatımı Evleri Sitesi</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* House Regulations & Emergency Contacts Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Regulations & House Rules */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base">{t.complexRules}</h3>
          </div>
          <ul className="space-y-2.5">
            {complex.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center mr-2.5 shrink-0">
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency & Operational Contacts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900">
            <Phone className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base">{t.emergencyContacts}</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-orange-900 uppercase">Site Staff / Caretaker (Kapıcı)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{complex.emergencyContact.caretaker}</p>
              </div>
              <span className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold text-orange-800 border border-orange-200">
                07:00 - 20:00
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Night Security Guard</span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{complex.emergencyContact.security}</p>
              </div>
              <span className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold text-slate-700 border border-slate-200">
                24 / 7
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Management Company Office</span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{complex.emergencyContact.management}</p>
              </div>
              <span className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold text-slate-700 border border-slate-200">
                Alanya Merkez
              </span>
            </div>

            <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-900 uppercase">Emergency Service (Police / Ambulance / Fire)</span>
                <p className="font-bold text-red-950 text-sm mt-0.5">112 (Acil Çağrı Merkezi)</p>
              </div>
              <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">
                112
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Photo Media Gallery */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900">
            <ImageIcon className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base">{t.photoGallery}</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">{complex.galleryPhotos.length} Images</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {complex.galleryPhotos.map((photo, index) => (
            <div
              key={index}
              onClick={() => setActivePhotoModal(photo)}
              className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer shadow-2xs hover:shadow-md transition-all"
            >
              <img
                src={photo}
                alt={`Complex amenity ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity">
                  {t.view}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">{t.editComplexDetails}</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 pt-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complex Display Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Native Name (Turkish)</label>
                  <input
                    type="text"
                    value={formData.nativeName}
                    onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tax Number (VKN)</label>
                  <input
                    type="text"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tax Office</label>
                  <input
                    type="text"
                    value={formData.taxOffice}
                    onChange={(e) => setFormData({ ...formData, taxOffice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name & Branch</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Site IBAN</label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    className="w-full px-3 py-2 font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={activePhotoModal}
              alt="Expanded view"
              className="w-full max-h-[85vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
