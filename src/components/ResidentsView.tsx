import React, { useEffect, useState } from 'react';
import { Apartment, ApartmentOwner, Building, Language, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { ApartmentsView } from './ApartmentsView';

interface ResidentsViewProps { currentLang: Language; currentRole: UserRole; }

export const ResidentsView: React.FC<ResidentsViewProps> = ({ currentLang, currentRole }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const load = async () => {
    const [apartmentsResult, buildingsResult, ownersResult, recipientsResult, usersResult] = await Promise.all([
      supabase.from('apartments').select('id,building_id,apartment_number').order('building_id').order('apartment_number'),
      supabase.from('buildings').select('id,name').order('id'),
      supabase.from('apartment_owner').select('apartment_id,user_id'),
      supabase.from('invoice_recipients').select('apartment_id,user_id'),
      supabase.from('owners').select('id,first_name,last_name,email,default_language').order('last_name')
    ]);
    if (apartmentsResult.error) throw apartmentsResult.error;
    if (buildingsResult.error) throw buildingsResult.error;
    if (ownersResult.error) throw ownersResult.error;
    if (recipientsResult.error) throw recipientsResult.error;
    if (usersResult.error) throw usersResult.error;
    const buildingRows = buildingsResult.data || [];
    const userMap = new Map((usersResult.data || []).map((u: any) => [u.id, u]));
    const ownerRows = ownersResult.data || [];
    const recipientRows = recipientsResult.data || [];
    const buildingMap = new Map(buildingRows.map((b: any) => [Number(b.id), b.name || '']));
    setBuildings(buildingRows.map((b: any) => ({ id: String(b.id), blockCode: b.name, name: b.name, totalFloors: 0, totalUnits: 0, occupiedUnits: 0, caretakerName: '', caretakerPhone: '', elevatorCount: 0, heatingType: '', photos: [], documentsCount: 0, notes: '' })));
    setApartments((apartmentsResult.data || []).map((a: any) => {
      const owners = ownerRows.filter((o: any) => Number(o.apartment_id) === Number(a.id)).map((o: any): ApartmentOwner => { const u: any = userMap.get(o.user_id); return { userId:o.user_id, firstName:u?.first_name||'', lastName:u?.last_name||'', email:u?.email||'', defaultLanguage:u?.default_language||'en' }; });
      return { id:Number(a.id), buildingId:Number(a.building_id), buildingName:buildingMap.get(Number(a.building_id))||'', apartmentNumber:a.apartment_number, owners, invoiceRecipientIds:recipientRows.filter((r:any)=>Number(r.apartment_id)===Number(a.id)).map((r:any)=>r.user_id) };
    }));
  };
  useEffect(()=>{void load().catch(error=>console.error('Failed to load apartments:',error));},[]);
  return <ApartmentsView apartments={apartments} buildings={buildings} currentRole={currentRole} currentLang={currentLang} onRefresh={async()=>{await load();}} />;
};
