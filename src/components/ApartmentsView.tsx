import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Plus, Users, Mail, Save, X } from 'lucide-react';
import { Apartment, ApartmentOwner, Building, Language, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { translations } from '../i18n/translations';

interface ApartmentsViewProps {
  apartments: Apartment[];
  buildings: Building[];
  currentRole: UserRole;
  currentLang: Language;
  onRefresh: () => Promise<void>;
}

interface UserOption extends ApartmentOwner { id: string; }

export const ApartmentsView: React.FC<ApartmentsViewProps> = ({ apartments, buildings, currentRole, currentLang, onRefresh }) => {
  const t = translations[currentLang];
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [newNumber, setNewNumber] = useState('');
  const [newBuildingId, setNewBuildingId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const canManage = ['admin', 'management_company', 'chairman'].includes(currentRole);

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase.from('user_profiles').select('id,first_name,last_name,email,default_language').order('last_name');
      setUsers((data || []).map((u: any) => ({ id: u.id, userId: u.id, firstName: u.first_name || '', lastName: u.last_name || '', email: u.email || '', defaultLanguage: u.default_language || 'en' })));
    };
    void loadUsers();
  }, []);

  const byBuilding = useMemo(() => apartments.reduce<Record<number, Apartment[]>>((acc, apartment) => { (acc[apartment.buildingId] ||= []).push(apartment); return acc; }, {}), [apartments]);

  const createApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim() || !newBuildingId) return;
    setSaving(true);
    const { error } = await supabase.from('apartments').insert({ building_id: Number(newBuildingId), apartment_number: newNumber.trim() });
    setSaving(false);
    if (error) { alert(error.message); return; }
    setNewNumber('');
    await onRefresh();
  };

  const toggleOwner = async (apartment: Apartment, user: UserOption) => {
    const exists = apartment.owners.some(o => o.userId === user.id);
    if (exists) {
      const { error } = await supabase.from('apartment_owners').delete().eq('apartment_id', apartment.id).eq('user_id', user.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('apartment_owners').insert({ apartment_id: apartment.id, user_id: user.id });
      if (error) alert(error.message);
    }
    await onRefresh();
    setSelectedApartment(null);
  };

  const toggleRecipient = async (apartment: Apartment, userId: string) => {
    const exists = (apartment.invoiceRecipientIds || []).includes(userId);
    if (exists) {
      await supabase.from('invoice_recipients').delete().eq('apartment_id', apartment.id).eq('user_id', userId);
    } else {
      await supabase.from('invoice_recipients').insert({ apartment_id: apartment.id, user_id: userId });
    }
    await onRefresh();
    setSelectedApartment(null);
  };

  return <div className="space-y-6">
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-xl font-bold text-slate-900">{t.residentsTitle || 'Apartments'}</h2><p className="text-xs text-slate-500 mt-1">Apartments and their owners. Invoices belong to apartments, not users.</p></div>
      </div>
      {canManage && <form onSubmit={createApartment} className="mt-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
        <select value={newBuildingId} onChange={e => setNewBuildingId(e.target.value ? Number(e.target.value) : '')} className="px-3 py-2 border rounded-lg text-sm" required>
          <option value="">Select building</option>{buildings.map(b => <option key={b.id} value={Number(b.id)}>{b.name}</option>)}
        </select>
        <input value={newNumber} onChange={e => setNewNumber(e.target.value)} placeholder="Apartment number" className="px-3 py-2 border rounded-lg text-sm" required />
        <button disabled={saving} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold inline-flex items-center justify-center"><Plus className="w-4 h-4 mr-1" />Add apartment</button>
      </form>}
    </div>

    {buildings.map(building => <section key={building.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 bg-slate-50 border-b flex items-center gap-2 font-bold"><Building2 className="w-4 h-4 text-teal-600" />{building.name}</div>
      <div className="divide-y">
        {(byBuilding[Number(building.id)] || []).map(apartment => <div key={apartment.id} className="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div><div className="font-bold text-slate-900">Apartment {apartment.apartmentNumber}</div><div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2"><Users className="w-3.5 h-3.5" />{apartment.owners.length ? apartment.owners.map(o => `${o.firstName} ${o.lastName}`).join(', ') : 'No owners assigned'}</div></div>
          <div className="flex flex-wrap gap-2">{apartment.owners.map(o => <span key={o.userId} className="text-[11px] px-2 py-1 bg-slate-100 rounded-lg">{o.firstName} {o.lastName}{(apartment.invoiceRecipientIds || []).includes(o.userId) ? ' • Invoice recipient' : ''}</span>)}
            {canManage && <button onClick={() => setSelectedApartment(apartment)} className="px-3 py-1.5 border border-teal-200 text-teal-800 rounded-lg text-xs font-bold"><Users className="inline w-3.5 h-3.5 mr-1" />Owners / recipients</button>}
          </div>
        </div>)}
        {!(byBuilding[Number(building.id)] || []).length && <div className="px-5 py-8 text-sm text-slate-500">No apartments yet.</div>}
      </div>
    </section>)}

    {selectedApartment && <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl"><div className="flex justify-between items-center"><h3 className="font-bold">Apartment {selectedApartment.apartmentNumber}</h3><button onClick={() => setSelectedApartment(null)}><X className="w-5 h-5" /></button></div><p className="text-xs text-slate-500 mt-1">Select owners and invoice recipients independently.</p><div className="mt-5 space-y-2">{users.map(user => { const owner = selectedApartment.owners.some(o => o.userId === user.id); const recipient = (selectedApartment.invoiceRecipientIds || []).includes(user.id); return <div key={user.id} className="flex items-center justify-between border rounded-xl p-3"><div><div className="text-sm font-bold">{user.firstName} {user.lastName}</div><div className="text-[11px] text-slate-500 flex items-center"><Mail className="w-3 h-3 mr-1" />{user.email}</div></div><div className="flex gap-2"><button onClick={() => void toggleOwner(selectedApartment, user)} className={`px-2 py-1 rounded text-[11px] font-bold ${owner ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'}`}>{owner ? 'Owner' : 'Add owner'}</button>{owner && <button onClick={() => void toggleRecipient(selectedApartment, user.id)} className={`px-2 py-1 rounded text-[11px] font-bold ${recipient ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'}`}>{recipient ? 'Invoice recipient' : 'Add recipient'}</button>}</div></div>})}</div><button onClick={() => setSelectedApartment(null)} className="mt-5 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold"><Save className="inline w-4 h-4 mr-1" />Done</button></div></div>}
  </div>;
};