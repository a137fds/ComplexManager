import React, { useEffect, useState } from 'react';
import { Apartment, ApartmentOwner, Building, Language, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { ApartmentsView } from './ApartmentsView';

interface ResidentsViewProps { currentLang: Language; currentRole: UserRole; }

export const ResidentsView: React.FC<ResidentsViewProps> = ({ currentLang, currentRole }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const load = async () => {
    const [{ data: apartmentRows }, { data: buildingRows }] = await Promise.all([
      supabase.from('apartments').select('id,building_id,apartment_number,buildings(name),apartment_owners(user_id,user_profiles(first_name,last_name,email,default_language)),invoice_recipients(user_id)').order('building_id').order('apartment_number'),
      supabase.from('buildings').select('id,name').order('id')
    ]);
    setBuildings((buildingRows || []).map((b: any) => ({ id: String(b.id), blockCode: b.name, name: b.name, totalFloors: 0, totalUnits: 0, occupiedUnits: 0, caretakerName: '', caretakerPhone: '', elevatorCount: 0, heatingType: '', photos: [], documentsCount: 0, notes: '' })));
    setApartments((apartmentRows || []).map((a: any) => ({
      id: Number(a.id), buildingId: Number(a.building_id), buildingName: a.buildings?.name || '', apartmentNumber: a.apartment_number,
      owners: (a.apartment_owners || []).map((o: any): ApartmentOwner => ({ userId: o.user_id, firstName: o.user_profiles?.first_name || '', lastName: o.user_profiles?.last_name || '', email: o.user_profiles?.email || '', defaultLanguage: o.user_profiles?.default_language || 'en' })),
      invoiceRecipientIds: (a.invoice_recipients || []).map((r: any) => r.user_id)
    })));
  };

  useEffect(() => { void load(); }, []);
  return <ApartmentsView apartments={apartments} buildings={buildings} currentRole={currentRole} currentLang={currentLang} onRefresh={load} />;
};
