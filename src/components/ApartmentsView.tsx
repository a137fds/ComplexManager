import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Edit2, Loader2, Mail, Plus, Search, X } from 'lucide-react';
import { Apartment, ApartmentOwner, Building, Language, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface ApartmentsViewProps { apartments: Apartment[]; buildings: Building[]; currentRole: UserRole; currentLang: Language; onRefresh: () => Promise<void>; }
interface UserOption extends ApartmentOwner { id: string; }

const labels: Record<Language, any> = {
  en:{title:'Apartments',subtitle:'Apartments and their owners. Invoices belong to apartments, not users.',selectBuilding:'Select building',number:'Apartment number',building:'Building',add:'Add apartment',noApartments:'No apartments found',noOwners:'No owners assigned',recipientColumn:'Invoice recipients',recipient:'Invoice recipients',owner:'Owners',chooseOwner:'Select owners...',chooseRecipient:'Select recipients...',searchOwner:'Search owners...',noMatches:'No matching owners',noRecipients:'Select owners first',save:'Save',cancel:'Cancel',edit:'Edit apartment',saving:'Saving...',duplicate:'An apartment with this number already exists in the selected building.',genericError:'The apartment could not be saved. Please try again.'},
  ru:{title:'Квартиры',subtitle:'Квартиры и их собственники. Квитанции относятся к квартире, а не к пользователю.',selectBuilding:'Выберите здание',number:'Номер квартиры',building:'Здание',add:'Добавить квартиру',noApartments:'Квартиры не найдены',noOwners:'Собственники не назначены',recipientColumn:'Получатели квитанции',recipient:'Получатели квитанции',owner:'Собственники',chooseOwner:'Выберите собственников...',chooseRecipient:'Выберите получателей...',searchOwner:'Поиск собственника...',noMatches:'Ничего не найдено',noRecipients:'Сначала выберите собственников',save:'Сохранить',cancel:'Отмена',edit:'Редактировать квартиру',saving:'Сохранение...',duplicate:'Квартира с таким номером уже существует в выбранном здании.',genericError:'Не удалось сохранить квартиру. Попробуйте ещё раз.'},
  tr:{title:'Daireler',subtitle:'Daireler ve malikleri. Faturalar dairelere aittir.',selectBuilding:'Bina seçin',number:'Daire numarası',building:'Bina',add:'Daire ekle',noApartments:'Daire bulunamadı',noOwners:'Malik atanmadı',recipientColumn:'Fatura alıcıları',recipient:'Fatura alıcıları',owner:'Malikler',chooseOwner:'Malik seçin...',chooseRecipient:'Alıcı seçin...',searchOwner:'Malik ara...',noMatches:'Sonuç bulunamadı',noRecipients:'Önce malik seçin',save:'Kaydet',cancel:'İptal',edit:'Daireyi düzenle',saving:'Kaydediliyor...',duplicate:'Bu numaraya sahip bir daire zaten mevcut.',genericError:'Daire kaydedilemedi.'},
  fr:{title:'Appartements',subtitle:'Appartements et propriétaires.',selectBuilding:'Sélectionner le bâtiment',number:'Numéro d’appartement',building:'Bâtiment',add:'Ajouter',noApartments:'Aucun appartement',noOwners:'Aucun propriétaire',recipientColumn:'Destinataires de facture',recipient:'Destinataires de facture',owner:'Propriétaires',chooseOwner:'Sélectionner les propriétaires...',chooseRecipient:'Sélectionner les destinataires...',searchOwner:'Rechercher un propriétaire...',noMatches:'Aucun résultat',noRecipients:'Sélectionnez d’abord des propriétaires',save:'Enregistrer',cancel:'Annuler',edit:'Modifier l’appartement',saving:'Enregistrement...',duplicate:'Cet appartement existe déjà.',genericError:'Impossible d’enregistrer.'},
  da:{title:'Lejligheder',subtitle:'Lejligheder og ejere.',selectBuilding:'Vælg bygning',number:'Lejlighedsnummer',building:'Bygning',add:'Tilføj lejlighed',noApartments:'Ingen lejligheder fundet',noOwners:'Ingen ejere',recipientColumn:'Fakturamodtagere',recipient:'Fakturamodtagere',owner:'Ejere',chooseOwner:'Vælg ejere...',chooseRecipient:'Vælg modtagere...',searchOwner:'Søg efter ejer...',noMatches:'Ingen resultater',noRecipients:'Vælg ejere først',save:'Gem',cancel:'Annuller',edit:'Rediger lejlighed',saving:'Gemmer...',duplicate:'Lejligheden findes allerede.',genericError:'Lejligheden kunne ikke gemmes.'},
  sv:{title:'Lägenheter',subtitle:'Lägenheter och ägare.',selectBuilding:'Välj byggnad',number:'Lägenhetsnummer',building:'Byggnad',add:'Lägg till lägenhet',noApartments:'Inga lägenheter hittades',noOwners:'Inga ägare',recipientColumn:'Fakturamottagare',recipient:'Fakturamottagare',owner:'Ägare',chooseOwner:'Välj ägare...',chooseRecipient:'Välj mottagare...',searchOwner:'Sök efter ägare...',noMatches:'Inga resultat',noRecipients:'Välj ägare först',save:'Spara',cancel:'Avbryt',edit:'Redigera lägenhet',saving:'Sparar...',duplicate:'Lägenheten finns redan.',genericError:'Lägenheten kunde inte sparas.'},
  pl:{title:'Mieszkania',subtitle:'Mieszkania i właściciele.',selectBuilding:'Wybierz budynek',number:'Numer mieszkania',building:'Budynek',add:'Dodaj mieszkanie',noApartments:'Nie znaleziono mieszkań',noOwners:'Brak właścicieli',recipientColumn:'Odbiorcy faktury',recipient:'Odbiorcy faktury',owner:'Właściciele',chooseOwner:'Wybierz właścicieli...',chooseRecipient:'Wybierz odbiorców...',searchOwner:'Szukaj właściciela...',noMatches:'Brak wyników',noRecipients:'Najpierw wybierz właścicieli',save:'Zapisz',cancel:'Anuluj',edit:'Edytuj mieszkanie',saving:'Zapisywanie...',duplicate:'Mieszkanie już istnieje.',genericError:'Nie udało się zapisać.'}
};

const sameIds = (a: string[], b: string[]) => a.slice().sort().join(',') === b.slice().sort().join(',');

export const ApartmentsView: React.FC<ApartmentsViewProps> = ({ apartments, buildings, currentRole, currentLang, onRefresh }) => {
  const t = labels[currentLang];
  const canManage = ['admin','management_company','chairman'].includes(currentRole);
  const [users,setUsers] = useState<UserOption[]>([]);
  const [loadingUsers,setLoadingUsers] = useState(true);
  const [selected,setSelected] = useState<Apartment|null>(null);
  const [draftNumber,setDraftNumber] = useState('');
  const [draftBuilding,setDraftBuilding] = useState<number|''>('');
  const [draftOwners,setDraftOwners] = useState<string[]>([]);
  const [draftRecipients,setDraftRecipients] = useState<string[]>([]);
  const [newNumber,setNewNumber] = useState('');
  const [newBuilding,setNewBuilding] = useState<number|''>('');
  const [saving,setSaving] = useState(false);
  const [ownerSearch,setOwnerSearch] = useState('');
  const [ownerOpen,setOwnerOpen] = useState(false);
  const [recipientOpen,setRecipientOpen] = useState(false);
  const ownerRef = useRef<HTMLDivElement|null>(null);
  const recipientRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase.from('owners').select('id,first_name,last_name,email,default_language').order('last_name').order('first_name');
        if (error) throw error;
        setUsers((data || []).map((u:any) => ({ id:u.id, userId:u.id, firstName:u.first_name||'', lastName:u.last_name||'', email:u.email||'', defaultLanguage:u.default_language||'en' })));
      } finally { setLoadingUsers(false); }
    };
    void load();
  }, []);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ownerRef.current?.contains(target)) setOwnerOpen(false);
      if (!recipientRef.current?.contains(target)) setRecipientOpen(false);
    };
    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  const openEdit = (apartment:Apartment) => {
    setSelected(apartment);
    setDraftNumber(apartment.apartmentNumber);
    setDraftBuilding(Number(apartment.buildingId));
    setDraftOwners(apartment.owners.map(owner => owner.userId));
    setDraftRecipients([...(apartment.invoiceRecipientIds || [])]);
    setOwnerSearch(''); setOwnerOpen(false); setRecipientOpen(false);
  };
  const closeEdit = () => { if (!saving) setSelected(null); };
  const personName = (user:UserOption) => `${user.firstName} ${user.lastName}`.trim() || user.email;

  const ownerOptions = useMemo(() => {
    const search = ownerSearch.trim().toLowerCase();
    return users.filter(user => !draftOwners.includes(user.id) && (!search || `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search)));
  }, [users,draftOwners,ownerSearch]);
  const selectedOwners = useMemo(() => users.filter(user => draftOwners.includes(user.id)), [users,draftOwners]);
  const selectedRecipients = useMemo(() => users.filter(user => draftRecipients.includes(user.id)), [users,draftRecipients]);
  const recipientOptions = useMemo(() => selectedOwners.filter(user => !draftRecipients.includes(user.id)), [selectedOwners,draftRecipients]);
  const dirty = !!selected && (draftNumber.trim() !== selected.apartmentNumber || Number(draftBuilding) !== Number(selected.buildingId) || !sameIds(draftOwners, selected.owners.map(owner => owner.userId)) || !sameIds(draftRecipients, selected.invoiceRecipientIds || []));

  const addOwner = (userId:string) => { setDraftOwners(previous => [...previous,userId]); setOwnerSearch(''); setOwnerOpen(false); };
  const removeOwner = (userId:string) => { setDraftOwners(previous => previous.filter(id => id !== userId)); setDraftRecipients(previous => previous.filter(id => id !== userId)); };
  const addRecipient = (userId:string) => { setDraftRecipients(previous => [...previous,userId]); setRecipientOpen(false); };
  const removeRecipient = (userId:string) => { setDraftRecipients(previous => previous.filter(id => id !== userId)); };

  const saveChanges = async () => {
    if (!selected || !dirty || !draftNumber.trim() || !draftBuilding) return;
    setSaving(true);
    try {
      if (draftNumber.trim() !== selected.apartmentNumber || Number(draftBuilding) !== Number(selected.buildingId)) {
        const { error } = await supabase.from('apartments').update({ building_id:Number(draftBuilding), apartment_number:draftNumber.trim() }).eq('id',selected.id);
        if (error) throw new Error(error.code === '23505' ? t.duplicate : t.genericError);
      }
      const oldOwners = selected.owners.map(owner => owner.userId);
      for (const id of oldOwners.filter(ownerId => !draftOwners.includes(ownerId))) { const { error } = await supabase.from('apartment_owner').delete().eq('apartment_id',selected.id).eq('user_id',id); if (error) throw error; }
      for (const id of draftOwners.filter(ownerId => !oldOwners.includes(ownerId))) { const { error } = await supabase.from('apartment_owner').insert({ apartment_id:selected.id,user_id:id,ChangeUserID:id,ChangeDate:new Date().toISOString() }); if (error) throw error; }
      const oldRecipients = selected.invoiceRecipientIds || [];
      for (const id of oldRecipients.filter(recipientId => !draftRecipients.includes(recipientId))) { const { error } = await supabase.from('invoice_recipients').delete().eq('apartment_id',selected.id).eq('user_id',id); if (error) throw error; }
      for (const id of draftRecipients.filter(recipientId => !oldRecipients.includes(recipientId))) { const { error } = await supabase.from('invoice_recipients').insert({ apartment_id:selected.id,user_id:id }); if (error) throw error; }
      await onRefresh(); setSelected(null);
    } catch (error) { alert(error instanceof Error ? error.message : t.genericError); }
    finally { setSaving(false); }
  };

  const createApartment = async (event:React.FormEvent) => {
    event.preventDefault(); if (!newNumber.trim() || !newBuilding) return; setSaving(true);
    const { error } = await supabase.from('apartments').insert({ building_id:Number(newBuilding), apartment_number:newNumber.trim() });
    setSaving(false); if (error) { alert(error.code === '23505' ? t.duplicate : t.genericError); return; }
    setNewNumber(''); await onRefresh();
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"><h2 className="text-xl font-bold text-slate-900">{t.title}</h2><p className="mt-1 text-xs text-slate-500">{t.subtitle}</p>{canManage && <form onSubmit={createApartment} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]"><select value={newBuilding} onChange={event=>setNewBuilding(event.target.value?Number(event.target.value):'')} className="rounded-lg border px-3 py-2 text-sm" required><option value="">{t.selectBuilding}</option>{buildings.map(building=><option key={building.id} value={Number(building.id)}>{building.name}</option>)}</select><input value={newNumber} onChange={event=>setNewNumber(event.target.value)} placeholder={t.number} className="rounded-lg border px-3 py-2 text-sm" required/><button disabled={saving} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><Plus className="mr-1 inline h-4 w-4"/>{t.add}</button></form>}</div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-slate-50"><tr><th className="px-5 py-3 text-left">{t.building}</th><th className="px-5 py-3 text-left">{t.number}</th><th className="px-5 py-3 text-left">{t.owner}</th><th className="px-5 py-3 text-left">{t.recipientColumn}</th><th className="px-5 py-3 text-right"/></tr></thead><tbody className="divide-y">{apartments.map(apartment=><tr key={apartment.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold">{apartment.buildingName}</td><td className="px-5 py-4 font-bold">{apartment.apartmentNumber}</td><td className="px-5 py-4 text-slate-600">{apartment.owners.length?apartment.owners.map(owner=>`${owner.firstName} ${owner.lastName}`).join(', '):t.noOwners}</td><td className="px-5 py-4 text-slate-600">{(apartment.invoiceRecipientIds||[]).map(id=>{const user=users.find(option=>option.id===id);return user?personName(user):''}).filter(Boolean).join(', ')||'—'}</td><td className="px-5 py-4 text-right">{canManage && <button title={t.edit} aria-label={t.edit} onClick={()=>openEdit(apartment)} className="rounded-lg p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-700"><Edit2 className="h-4 w-4"/></button>}</td></tr>)}{!apartments.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">{t.noApartments}</td></tr>}</tbody></table></div></div>

    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><form onSubmit={event=>{event.preventDefault();void saveChanges();}} className="w-full max-w-xl overflow-visible rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between rounded-t-2xl border-b border-slate-100 p-6"><div><h3 className="text-lg font-bold text-slate-900">{t.edit}: {selected.apartmentNumber}</h3><p className="mt-1 text-xs text-slate-500">{t.subtitle}</p></div><button type="button" onClick={closeEdit} disabled={saving} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5"/></button></div>
      <div className="space-y-5 p-6"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className="block text-xs font-bold text-slate-600">{t.building}</label><select value={draftBuilding} onChange={event=>setDraftBuilding(Number(event.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">{buildings.map(building=><option key={building.id} value={Number(building.id)}>{building.name}</option>)}</select></div><div><label className="block text-xs font-bold text-slate-600">{t.number}</label><input value={draftNumber} onChange={event=>setDraftNumber(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"/></div></div>
        <div ref={ownerRef} className="relative"><label className="block text-xs font-bold text-slate-600">{t.owner}</label><div className="mt-1 min-h-[46px] rounded-xl border border-slate-300 bg-white p-2"><div className="flex flex-wrap items-center gap-2">{selectedOwners.map(user=><span key={user.id} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800"><span className="max-w-[180px] truncate">{`${user.firstName} ${user.lastName}`.trim() || user.email}</span><button type="button" onClick={()=>removeOwner(user.id)} className="rounded-full p-0.5 hover:bg-teal-100"><X className="h-3 w-3"/></button></span>)}<div className="min-w-[180px] flex-1"><div className="flex items-center gap-2"><Search className="h-4 w-4 text-slate-400"/><input value={ownerSearch} onFocus={()=>setOwnerOpen(true)} onChange={event=>{setOwnerSearch(event.target.value);setOwnerOpen(true);}} placeholder={selectedOwners.length?t.searchOwner:t.chooseOwner} className="w-full border-0 bg-transparent px-1 py-1 text-sm outline-none"/></div></div></div></div>{ownerOpen && <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">{loadingUsers?<div className="p-4 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-400"/></div>:ownerOptions.length?ownerOptions.map(user=><button key={user.id} type="button" onClick={()=>addOwner(user.id)} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-slate-50"><div className="min-w-0"><div className="truncate text-sm font-semibold">{`${user.firstName} ${user.lastName}`.trim() || user.email}</div><div className="truncate text-[11px] text-slate-500"><Mail className="mr-1 inline h-3 w-3"/>{user.email}</div></div><Plus className="h-4 w-4 shrink-0 text-teal-600"/></button>):<div className="p-4 text-center text-sm text-slate-500">{t.noMatches}</div>}</div>}</div>
        <div ref={recipientRef} className="relative"><label className="block text-xs font-bold text-slate-600">{t.recipient}</label><div className="mt-1 min-h-[46px] rounded-xl border border-slate-300 bg-white p-2"><div className="flex flex-wrap items-center gap-2">{selectedRecipients.map(user=><span key={user.id} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800"><span className="max-w-[180px] truncate">{`${user.firstName} ${user.lastName}`.trim() || user.email}</span><button type="button" onClick={()=>removeRecipient(user.id)} className="rounded-full p-0.5 hover:bg-indigo-100"><X className="h-3 w-3"/></button></span>)}<button type="button" onClick={()=>{if(selectedOwners.length){setRecipientOpen(open=>!open);setOwnerOpen(false);}}} disabled={!selectedOwners.length} className="flex min-w-[180px] flex-1 items-center justify-between gap-2 px-1 py-1 text-left text-sm text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"><span>{selectedRecipients.length?'Add recipient...':(selectedOwners.length?t.chooseRecipient:t.noRecipients)}</span><ChevronDown className="h-4 w-4"/></button></div></div>{recipientOpen && selectedOwners.length>0 && <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">{recipientOptions.length?recipientOptions.map(user=><button key={user.id} type="button" onClick={()=>addRecipient(user.id)} className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-slate-50"><span>{`${user.firstName} ${user.lastName}`.trim() || user.email}</span><Check className="h-4 w-4 text-indigo-600"/></button>):<div className="p-4 text-center text-sm text-slate-500">{selectedRecipients.length?'All selected owners are recipients':t.chooseRecipient}</div>}</div>}</div>
      </div><div className="flex justify-end gap-2 rounded-b-2xl border-t border-slate-100 p-6"><button type="button" onClick={closeEdit} disabled={saving} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600">{t.cancel}</button><button type="submit" disabled={!dirty||saving} className={`rounded-xl px-4 py-2 font-semibold ${dirty&&!saving?'bg-teal-600 text-white hover:bg-teal-500':'cursor-not-allowed bg-slate-200 text-slate-400'}`}>{saving?t.saving:t.save}</button></div>
    </form></div>}
  </div>;
};