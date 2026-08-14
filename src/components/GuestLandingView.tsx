import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Waves,
  SunMedium
} from 'lucide-react';
import { ComplexInfo, Language } from '../types';
import { translations } from '../i18n/translations';

interface GuestLandingViewProps {
  complex: ComplexInfo;
  currentLang: Language;
  onExploreClick: () => void;
}

export const GuestLandingView: React.FC<GuestLandingViewProps> = ({
  complex,
  currentLang,
  onExploreClick
}) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-8">
      {/* Hero Presentation */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white min-h-[420px] flex items-center shadow-lg">
        <img
          src={complex.representativePhoto}
          alt={complex.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alanya Mahmutlar Riviera • Residential Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {complex.name}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {complex.description[currentLang] || complex.description.en}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
            <span className="flex items-center text-teal-300">
              <MapPin className="w-4 h-4 mr-1" />
              {complex.district}, {complex.city}, {complex.country}
            </span>
            <span className="flex items-center text-teal-300">
              <Calendar className="w-4 h-4 mr-1" />
              Established {complex.constructionYear}
            </span>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Architectural Scale</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Comprising 3 luxury residential blocks (Block A, B, and C) housing 48 private residential units with manicured Mediterranean landscaping.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Waves className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Amenities & Comfort</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Features an Olympic-style swimming pool, heated indoor spa, backup diesel generator, VRF climate systems, and dual high-speed elevators per block.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Certified Governance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fully compliant with Turkish Condominium Law (634 Sayılı KMK) with transparent financial audits, online dues accounting, and 24/7 security.
          </p>
        </div>
      </div>

      {/* Community Rules Preview & Management Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">{t.complexRules}</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {complex.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center mr-2 shrink-0">
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Management Office</h3>
            <p className="text-xs text-slate-500 mt-1">
              For inquiries regarding apartment ownership, long-term rentals, or site administration:
            </p>
            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Site Management Operator</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Alanya Site Management Ltd. Şti.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Direct Emergency Caretaker (Kapıcı)</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{complex.emergencyContact.caretaker}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Official site registration: VKN {complex.taxNumber} ({complex.taxOffice})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
