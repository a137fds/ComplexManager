import React, { useEffect, useMemo, useState } from 'react';
import { Layers, Building2, MapPin, User, Clock, Plus, Edit2, Trash2, RefreshCw, Search, Filter, X, AlertTriangle } from 'lucide-react';
import { BuildingEntity, ComplexEntity } from '../api/databaseApi';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';
import { supabase } from '../lib/supabase';

interface BuildingsViewProps {
  buildings: BuildingEntity[];
  complexes: ComplexEntity[];
  selectedComplexFilter: number | 'all';
  onSelectComplexFilter: (id: number | 'all') => void;
  onCreateBuilding: (data: { ComplexID: number; BuildingName: string }) => Promise<void>;
  onUpdateBuilding: (id: number, data: { ComplexID: number; BuildingName: string }) => Promise<void>;
  onDeleteBuilding: (id: number) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
  currentRole: UserRole;
  currentLang: Language;
}

type UiText = {
  buildingsTitle: string; registered: string; search: string; filterComplex: string; allComplexes: string; buildings: string;
  parent: string; address: string; changed: string; timestamp: string; noBuildings: string; noMatch: string; empty: string;
  add: string; buildingName: string; saving: string; create: string; edit: string; save: string; deleting: string;
  deleteConfirm: string; sure: string; from: string; yesDelete: string; required: string; parentRequired: string; system: string;
};

const uiText: Record<Language, UiText> = {
  en: { buildingsTitle: 'Buildings', registered: 'Registered buildings and their hierarchy are stored in PostgreSQL.', search: 'Search buildings by name or ID...', filterComplex: 'Filter Complex:', allComplexes: 'All Complexes', buildings: 'buildings', parent: 'Parent Complex', address: 'Registered site address', changed: 'Last changed by:', timestamp: 'Record timestamp:', noBuildings: 'No Buildings Found', noMatch: 'No buildings match your active search or filter criteria.', empty: 'There are currently no buildings in the database. Click below to add the first building.', add: 'Add Building', buildingName: 'Building Name', saving: 'Saving...', create: 'Create Building', edit: 'Edit Building', save: 'Save Changes', deleting: 'Deleting...', deleteConfirm: 'Delete Building', sure: 'Are you sure you want to permanently delete', from: 'from PostgreSQL?', yesDelete: 'Yes, Delete Building', required: 'Building name is required', parentRequired: 'Parent complex must be selected', system: 'system' },
  ru: { buildingsTitle: 'Корпуса', registered: 'Зарегистрированные корпуса и их иерархия хранятся в PostgreSQL.', search: 'Поиск корпуса по названию или ID...', filterComplex: 'Фильтр по комплексу:', allComplexes: 'Все комплексы', buildings: 'корпусов', parent: 'Родительский комплекс', address: 'Адрес комплекса', changed: 'Последнее изменение:', timestamp: 'Время записи:', noBuildings: 'Корпуса не найдены', noMatch: 'Нет корпусов, соответствующих поиску или фильтру.', empty: 'В базе данных пока нет корпусов. Нажмите ниже, чтобы добавить первый корпус.', add: 'Добавить корпус', buildingName: 'Название корпуса', saving: 'Сохранение...', create: 'Создать корпус', edit: 'Редактировать корпус', save: 'Сохранить изменения', deleting: 'Удаление...', deleteConfirm: 'Удалить корпус', sure: 'Вы уверены, что хотите окончательно удалить', from: 'из PostgreSQL?', yesDelete: 'Да, удалить корпус', required: 'Название корпуса обязательно', parentRequired: 'Необходимо выбрать комплекс', system: 'система' },
  tr: { buildingsTitle: 'Binalar', registered: "Kayıtlı binalar ve hiyerarşileri PostgreSQL'de saklanır.", search: 'Bina adı veya ID ile ara...', filterComplex: 'Kompleks filtresi:', allComplexes: 'Tüm kompleksler', buildings: 'bina', parent: 'Bağlı kompleks', address: 'Site adresi', changed: 'Son değiştiren:', timestamp: 'Kayıt zamanı:', noBuildings: 'Bina bulunamadı', noMatch: 'Arama veya filtreye uygun bina bulunamadı.', empty: 'Veritabanında henüz bina yok. İlk binayı eklemek için aşağıya tıklayın.', add: 'Bina Ekle', buildingName: 'Bina Adı', saving: 'Kaydediliyor...', create: 'Bina Oluştur', edit: 'Binayı Düzenle', save: 'Değişiklikleri Kaydet', deleting: 'Siliniyor...', deleteConfirm: 'Binayı Sil', sure: 'Bu binayı kalıcı olarak silmek istediğinizden emin misiniz:', from: 'PostgreSQL veritabanından?', yesDelete: 'Evet, Binayı Sil', required: 'Bina adı zorunludur', parentRequired: 'Bağlı kompleks seçilmelidir', system: 'sistem' },
  fr: { buildingsTitle: 'Bâtiments', registered: 'Les bâtiments enregistrés et leur hiérarchie sont stockés dans PostgreSQL.', search: 'Rechercher un bâtiment par nom ou ID...', filterComplex: 'Filtrer par résidence :', allComplexes: 'Toutes les résidences', buildings: 'bâtiments', parent: 'Résidence parente', address: 'Adresse de la résidence', changed: 'Dernière modification :', timestamp: 'Horodatage :', noBuildings: 'Aucun bâtiment trouvé', noMatch: 'Aucun bâtiment ne correspond aux critères de recherche ou de filtre.', empty: "Aucun bâtiment n'est actuellement enregistré. Cliquez ci-dessous pour ajouter le premier.", add: 'Ajouter un bâtiment', buildingName: 'Nom du bâtiment', saving: 'Enregistrement...', create: 'Créer le bâtiment', edit: 'Modifier le bâtiment', save: 'Enregistrer les modifications', deleting: 'Suppression...', deleteConfirm: 'Supprimer le bâtiment', sure: 'Voulez-vous supprimer définitivement', from: 'de PostgreSQL ?', yesDelete: 'Oui, supprimer', required: 'Le nom du bâtiment est obligatoire', parentRequired: 'La résidence parente doit être sélectionnée', system: 'système' },
  da: { buildingsTitle: 'Bygninger', registered: 'Registrerede bygninger og deres hierarki gemmes i PostgreSQL.', search: 'Søg efter bygning efter navn eller ID...', filterComplex: 'Filtrer kompleks:', allComplexes: 'Alle komplekser', buildings: 'bygninger', parent: 'Overordnet kompleks', address: 'Kompleksets adresse', changed: 'Sidst ændret af:', timestamp: 'Registreringstidspunkt:', noBuildings: 'Ingen bygninger fundet', noMatch: 'Ingen bygninger matcher den aktive søgning eller filtrering.', empty: 'Der er ingen bygninger i databasen endnu. Klik nedenfor for at tilføje den første.', add: 'Tilføj bygning', buildingName: 'Bygningsnavn', saving: 'Gemmer...', create: 'Opret bygning', edit: 'Rediger bygning', save: 'Gem ændringer', deleting: 'Sletter...', deleteConfirm: 'Slet bygning', sure: 'Er du sikker på, at du vil slette', from: 'fra PostgreSQL?', yesDelete: 'Ja, slet bygning', required: 'Bygningsnavn er påkrævet', parentRequired: 'Overordnet kompleks skal vælges', system: 'system' },
  sv: { buildingsTitle: 'Byggnader', registered: 'Registrerade byggnader och deras hierarki lagras i PostgreSQL.', search: 'Sök byggnad efter namn eller ID...', filterComplex: 'Filtrera komplex:', allComplexes: 'Alla komplex', buildings: 'byggnader', parent: 'Överordnat komplex', address: 'Komplexets adress', changed: 'Senast ändrad av:', timestamp: 'Registreringstid:', noBuildings: 'Inga byggnader hittades', noMatch: 'Inga byggnader matchar aktuell sökning eller filtrering.', empty: 'Det finns inga byggnader i databasen ännu. Klicka nedan för att lägga till den första.', add: 'Lägg till byggnad', buildingName: 'Byggnadsnamn', saving: 'Sparar...', create: 'Skapa byggnad', edit: 'Redigera byggnad', save: 'Spara ändringar', deleting: 'Tar bort...', deleteConfirm: 'Ta bort byggnad', sure: 'Är du säker på att du vill ta bort', from: 'från PostgreSQL?', yesDelete: 'Ja, ta bort byggnad', required: 'Byggnadsnamn krävs', parentRequired: 'Överordnat komplex måste väljas', system: 'system' },
  pl: { buildingsTitle: 'Budynki', registered: 'Zarejestrowane budynki i ich hierarchia są przechowywane w PostgreSQL.', search: 'Szukaj budynku po nazwie lub ID...', filterComplex: 'Filtruj kompleks:', allComplexes: 'Wszystkie kompleksy', buildings: 'budynków', parent: 'Kompleks nadrzędny', address: 'Adres kompleksu', changed: 'Ostatnio zmienione przez:', timestamp: 'Czas zapisu:', noBuildings: 'Nie znaleziono budynków', noMatch: 'Żaden budynek nie pasuje do wyszukiwania ani filtrów.', empty: 'W bazie nie ma jeszcze budynków. Kliknij poniżej, aby dodać pierwszy.', add: 'Dodaj budynek', buildingName: 'Nazwa budynku', saving: 'Zapisywanie...', create: 'Utwórz budynek', edit: 'Edytuj budynek', save: 'Zapisz zmiany', deleting: 'Usuwanie...', deleteConfirm: 'Usuń budynek', sure: 'Czy na pewno chcesz trwale usunąć', from: 'z PostgreSQL?', yesDelete: 'Tak, usuń budynek', required: 'Nazwa budynku jest wymagana', parentRequired: 'Należy wybrać kompleks nadrzędny', system: 'system' },
};

export const BuildingsView: React.FC<BuildingsViewProps> = ({ buildings, complexes, selectedComplexFilter, onSelectComplexFilter, onCreateBuilding, onUpdateBuilding, onDeleteBuilding, onRefresh, loading, currentRole, currentLang }) => {
  const t = translations[currentLang];
  const ui = uiText[currentLang];
  const canManage = ['admin', 'management_company', 'chairman', 'board_member'].includes(currentRole);
  const canViewChangeMeta = currentRole === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<BuildingEntity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [changeUserRoles, setChangeUserRoles] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ ComplexID: complexes[0]?.ComplexID || 1, BuildingName: '' });

  useEffect(() => {
    if (!canViewChangeMeta) return;
    const ids = [...new Set(buildings.map(b => b.ChangeUserID).filter((id): id is string => Boolean(id)))];
    if (!ids.length) { setChangeUserRoles({}); return; }
    void supabase.from('user_profiles').select('id, role').in('id', ids).then(({ data, error }) => {
      if (error) { console.error('Failed to load change-user roles:', error); return; }
      const roles: Record<string, string> = {};
      (data || []).forEach((item: any) => { roles[item.id] = item.role; });
      setChangeUserRoles(roles);
    });
  }, [buildings, canViewChangeMeta]);

  const filteredBuildings = useMemo(() => buildings.filter(b =>
    (selectedComplexFilter === 'all' || b.ComplexID === selectedComplexFilter) &&
    (!searchTerm || b.BuildingName.toLowerCase().includes(searchTerm.toLowerCase()) || String(b.BuildingID).includes(searchTerm) || (b.ComplexName && b.ComplexName.toLowerCase().includes(searchTerm.toLowerCase())))
  ), [buildings, selectedComplexFilter, searchTerm]);

  const roleLabel = (role?: string) => {
    if (!role) return ui.system;
    const labels: Record<string, string> = { admin: t.roleAdmin, management_company: t.roleManagementCompany, chairman: t.roleChairman, board_member: t.roleBoardMember, financial_controller: t.roleFinancialController, site_staff: t.roleSiteStaff, user: t.roleResident, guest: t.roleGuest };
    return labels[role] || ui.system;
  };

  const openAdd = () => { const id = selectedComplexFilter !== 'all' ? selectedComplexFilter : complexes[0]?.ComplexID || 1; setForm({ ComplexID: Number(id), BuildingName: '' }); setFormError(null); setModal('add'); };
  const openEdit = (building: BuildingEntity) => { setEditingBuilding(building); setForm({ ComplexID: building.ComplexID, BuildingName: building.BuildingName }); setFormError(null); setModal('edit'); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.BuildingName.trim()) return setFormError(ui.required);
    if (!form.ComplexID) return setFormError(ui.parentRequired);
    setSubmitting(true); setFormError(null);
    try {
      if (modal === 'add') await onCreateBuilding({ ComplexID: Number(form.ComplexID), BuildingName: form.BuildingName.trim() });
      if (modal === 'edit' && editingBuilding) await onUpdateBuilding(editingBuilding.BuildingID, { ComplexID: Number(form.ComplexID), BuildingName: form.BuildingName.trim() });
      setModal(null); setEditingBuilding(null);
    } catch (error: any) { setFormError(error.message || 'Operation failed'); }
    finally { setSubmitting(false); }
  };
  const confirmDelete = async () => {
    if (!editingBuilding) return;
    setSubmitting(true); setFormError(null);
    try { await onDeleteBuilding(editingBuilding.BuildingID); setModal(null); setEditingBuilding(null); }
    catch (error: any) { setFormError(error.message || 'Failed to delete building'); }
    finally { setSubmitting(false); }
  };

  const complexName = (complex: ComplexEntity) => `${complex.ComplexName} (${buildings.filter(b => b.ComplexID === complex.ComplexID).length} ${ui.buildings})`;

  return <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div><h2 className="text-xl font-bold text-slate-900">{ui.buildingsTitle}</h2><p className="text-xs text-slate-500 mt-1">{ui.registered}</p></div>
      <div className="flex items-center space-x-3"><button onClick={onRefresh} disabled={loading} className="p-2 text-slate-600 bg-slate-100 rounded-xl border border-slate-200" title={t.refresh}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>{canManage && <button onClick={openAdd} className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"><Plus className="w-4 h-4 mr-1.5" />{ui.add}</button>}</div>
    </div>
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="relative flex-1"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={ui.search} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" /></div>
      <div className="flex items-center space-x-2"><Filter className="w-4 h-4 text-slate-400" /><span className="text-xs font-semibold text-slate-600">{ui.filterComplex}</span><select value={selectedComplexFilter} onChange={e => onSelectComplexFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2"><option value="all">{ui.allComplexes} ({buildings.length} {ui.buildings})</option>{complexes.map(c => <option key={c.ComplexID} value={c.ComplexID}>{complexName(c)}</option>)}</select></div>
    </div>
    {filteredBuildings.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{filteredBuildings.map(building => { const parent = complexes.find(c => c.ComplexID === building.ComplexID); return <div key={building.BuildingID} className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><div className="p-5 bg-slate-50 border-b border-slate-100"><div className="flex items-start justify-between"><div><h3 className="font-extrabold text-slate-900">{building.BuildingName}</h3><div className="text-[11px] text-slate-500 mt-1">ID: {building.BuildingID}</div></div><Layers className="w-5 h-5 text-teal-600" /></div></div><div className="p-5 space-y-3 text-xs"><div className="p-3 bg-slate-50 rounded-xl"><div className="font-semibold text-slate-500">{ui.parent}</div><div className="font-bold text-slate-900 mt-1">{building.ComplexName || parent?.ComplexName || ''}</div><div className="text-slate-500 mt-1 flex items-center"><MapPin className="w-3 h-3 mr-1" />{building.Address || parent?.Address || ''}</div></div>{canViewChangeMeta && <div className="space-y-1.5"><div className="flex justify-between text-slate-500"><span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{ui.changed}</span><span className="font-semibold text-slate-700">{roleLabel(changeUserRoles[building.ChangeUserID || ''])}</span></div><div className="flex justify-between text-slate-500"><span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{ui.timestamp}</span><span className="font-medium text-slate-700">{new Date(building.ChangeDate).toLocaleString()}</span></div></div>}</div>{canManage && <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2"><button onClick={() => openEdit(building)} className="inline-flex items-center px-3 py-1.5 text-xs border rounded-lg font-bold"><Edit2 className="w-3.5 h-3.5 mr-1" />{t.edit}</button><button onClick={() => { setEditingBuilding(building); setFormError(null); setModal('delete'); }} className="inline-flex items-center px-3 py-1.5 text-xs text-red-600 border rounded-lg font-bold"><Trash2 className="w-3.5 h-3.5 mr-1" />{t.delete}</button></div>}</div>; })}</div> : <div className="bg-white rounded-2xl p-12 text-center border border-slate-200"><Layers className="w-12 h-12 text-slate-300 mx-auto" /><h3 className="text-base font-bold mt-3">{ui.noBuildings}</h3><p className="text-xs text-slate-500 mt-1">{searchTerm || selectedComplexFilter !== 'all' ? ui.noMatch : ui.empty}</p>{canManage && <button onClick={openAdd} className="mt-4 inline-flex items-center px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"><Plus className="w-4 h-4 mr-1.5" />{ui.add}</button>}</div>}

    {modal && <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"><div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
      {modal === 'delete' ? <><div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-5 h-5" /><h3 className="font-bold text-slate-900">{ui.deleteConfirm}</h3></div><p className="text-sm text-slate-600 mt-4">{ui.sure} <strong>{editingBuilding?.BuildingName}</strong> {ui.from}</p>{formError && <p className="text-sm text-red-600 mt-3">{formError}</p>}<div className="flex justify-end gap-2 mt-6"><button onClick={() => setModal(null)} className="px-4 py-2 border rounded-xl text-sm">{t.cancel}</button><button onClick={confirmDelete} disabled={submitting} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold">{submitting ? ui.deleting : ui.yesDelete}</button></div></> : <><div className="flex justify-between items-center"><h3 className="text-lg font-bold">{modal === 'add' ? ui.add : ui.edit}</h3><button onClick={() => setModal(null)}><X className="w-5 h-5" /></button></div>{formError && <p className="text-sm text-red-600 mt-3">{formError}</p>}<form onSubmit={submit} className="space-y-4 mt-5"><label className="block"><span className="text-xs font-semibold">{ui.parent}</span><select value={form.ComplexID} onChange={e => setForm({ ...form, ComplexID: Number(e.target.value) })} className="mt-1 w-full border rounded-xl px-3 py-2 text-sm">{complexes.map(c => <option key={c.ComplexID} value={c.ComplexID}>{c.ComplexName}</option>)}</select></label><label className="block"><span className="text-xs font-semibold">{ui.buildingName}</span><input value={form.BuildingName} onChange={e => setForm({ ...form, BuildingName: e.target.value })} className="mt-1 w-full border rounded-xl px-3 py-2 text-sm" required /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="px-4 py-2 border rounded-xl text-sm">{t.cancel}</button><button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold">{submitting ? ui.saving : modal === 'add' ? ui.create : ui.save}</button></div></form></>}
    </div></div>}
  </div>;
};