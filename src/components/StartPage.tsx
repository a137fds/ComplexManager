import React from 'react';
import { Building2, Layers } from 'lucide-react';
import { Language } from '../types';
import { ComplexEntity, BuildingEntity } from '../api/databaseApi';

interface StartPageProps {
  complexes: ComplexEntity[];
  buildings: BuildingEntity[];
  currentLang: Language;
  onOpenComplexes: () => void;
  onOpenBuildings: () => void;
}

const labels: Record<Language, { title: string; subtitle: string; complexes: string; buildings: string; open: string }> = {
  en: { title: 'Start Page', subtitle: 'Overview of your complex management workspace.', complexes: 'Complexes (Sites)', buildings: 'Buildings', open: 'Open' },
  ru: { title: 'Обзор', subtitle: 'Обзор вашей рабочей области управления комплексом.', complexes: 'Комплексы (Site)', buildings: 'Здания', open: 'Открыть' },
  tr: { title: 'Genel Bakış', subtitle: 'Site yönetimi çalışma alanınıza genel bakış.', complexes: 'Konut Kompleksleri (Site)', buildings: 'Binalar', open: 'Aç' },
  fr: { title: 'Vue d’ensemble', subtitle: 'Vue d’ensemble de votre espace de gestion de résidence.', complexes: 'Résidences (Site)', buildings: 'Bâtiments', open: 'Ouvrir' },
  da: { title: 'Oversigt', subtitle: 'Oversigt over dit administrationsområde for boligkomplekset.', complexes: 'Boligkomplekser (Site)', buildings: 'Bygninger', open: 'Åbn' },
  sv: { title: 'Översikt', subtitle: 'Översikt över din arbetsyta för komplexförvaltning.', complexes: 'Bostadskomplex (Site)', buildings: 'Byggnader', open: 'Öppna' },
  pl: { title: 'Przegląd', subtitle: 'Przegląd obszaru zarządzania kompleksem.', complexes: 'Kompleksy (Site)', buildings: 'Budynki', open: 'Otwórz' }
};

export const StartPage: React.FC<StartPageProps> = ({ complexes, buildings, currentLang, onOpenComplexes, onOpenBuildings }) => {
  const t = labels[currentLang];
  const cards = [
    { label: t.complexes, count: complexes.length, icon: Building2, onClick: onOpenComplexes },
    { label: t.buildings, count: buildings.length, icon: Layers, onClick: onOpenBuildings }
  ];

  return <section className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {cards.map(card => {
        const Icon = card.icon;
        return <button key={card.label} type="button" onClick={card.onClick} className="group text-left rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-teal-50 p-3"><Icon className="w-6 h-6 text-teal-700" /></div>
            <span className="text-xs font-semibold text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity">{t.open} →</span>
          </div>
          <div className="mt-5 text-4xl font-bold text-slate-900">{card.count}</div>
          <div className="mt-1 text-sm font-semibold text-slate-600">{card.label}</div>
        </button>;
      })}
    </div>
  </section>;
};
