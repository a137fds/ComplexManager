import React, { useEffect, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { Language, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { formatDateTime } from '../lib/dateFormat';

interface OwnersViewProps { currentLang: Language; currentRole: UserRole; }

type Owner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  defaultLanguage: string;
  apartments: string[];
  updatedAt: string | null;
};

const labels: Record<Language, any> = {
  en: { title:'Owners', subtitle:'Property owners and their apartments.', name:'Name', email:'Email', phone:'Phone', apartments:'Apartments', description:'Description', language:'Language', send:'Send password setup', sent:'Password setup email sent.', empty:'No owners found.', error:'The operation failed. Please try again.' },
  ru: { title:'Собственники', subtitle:'Собственники и принадлежащие им квартиры.', name:'ФИО', email:'Email', phone:'Телефон', apartments:'Квартиры', description:'Описание', language:'Язык', send:'Выслать пароль', sent:'Письмо для установки пароля отправлено.', empty:'Собственники не найдены.', error:'Ошибка выполнения операции. Попробуйте ещё раз.' },
  tr: { title:'Malikler', subtitle:'Malikler ve sahip oldukları daireler.', name:'Ad Soyad', email:'E-posta', phone:'Telefon', apartments:'Daireler', description:'Açıklama', language:'Dil', send:'Şifre kurulumu gönder', sent:'Şifre kurulum e-postası gönderildi.', empty:'Malik bulunamadı.', error:'İşlem başarısız oldu. Lütfen tekrar deneyin.' },
  fr: { title:'Propriétaires', subtitle:'Propriétaires et leurs appartements.', name:'Nom', email:'E-mail', phone:'Téléphone', apartments:'Appartements', description:'Description', language:'Langue', send:'Envoyer la configuration du mot de passe', sent:'E-mail de configuration envoyé.', empty:'Aucun propriétaire trouvé.', error:'Échec de l’opération. Veuillez réessayer.' },
  da: { title:'Ejere', subtitle:'Ejere og deres lejligheder.', name:'Navn', email:'E-mail', phone:'Telefon', apartments:'Lejligheder', description:'Beskrivelse', language:'Sprog', send:'Send adgangskodeopsætning', sent:'E-mail til adgangskodeopsætning sendt.', empty:'Ingen ejere fundet.', error:'Handlingen mislykkedes. Prøv igen.' },
  sv: { title:'Ägare', subtitle:'Ägare och deras lägenheter.', name:'Namn', email:'E-post', phone:'Telefon', apartments:'Lägenheter', description:'Beskrivning', language:'Språk', send:'Skicka lösenordsinställning', sent:'E-post för lösenordsinställning skickades.', empty:'Inga ägare hittades.', error:'Åtgärden misslyckades. Försök igen.' },
  pl: { title:'Właściciele', subtitle:'Właściciele i ich mieszkania.', name:'Imię i nazwisko', email:'E-mail', phone:'Telefon', apartments:'Mieszkania', description:'Opis', language:'Język', send:'Wyślij konfigurację hasła', sent:'Wysłano wiadomość do ustawienia hasła.', empty:'Nie znaleziono właścicieli.', error:'Operacja nie powiodła się. Spróbuj ponownie.' },
};

export const OwnersView: React.FC<OwnersViewProps> = ({ currentLang, currentRole }) => {
  const t = labels[currentLang];
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const canManage = ['admin', 'management_company', 'chairman'].includes(currentRole);

  const load = async () => {
    setLoading(true);
    try {
      const [profilesResult, linksResult, apartmentsResult, buildingsResult] = await Promise.all([
        supabase.from('user_profiles').select('id,first_name,last_name,email,phone,description,default_language,updated_at').order('last_name'),
        supabase.from('apartment_owners').select('apartment_id,user_id'),
        supabase.from('apartments').select('id,apartment_number,building_id'),
        supabase.from('buildings').select('id,name'),
      ]);
      if (profilesResult.error) throw profilesResult.error;
      if (linksResult.error) throw linksResult.error;
      if (apartmentsResult.error) throw apartmentsResult.error;
      if (buildingsResult.error) throw buildingsResult.error;

      const apartmentMap = new Map((apartmentsResult.data || []).map((a: any) => [Number(a.id), `${(buildingsResult.data || []).find((b: any) => Number(b.id) === Number(a.building_id))?.name || ''} / ${a.apartment_number}`]));
      const links = linksResult.data || [];
      setOwners((profilesResult.data || []).filter((p: any) => links.some((l: any) => l.user_id === p.id)).map((p: any) => ({
        id:p.id, firstName:p.first_name || '', lastName:p.last_name || '', email:p.email || '', phone:p.phone || '', description:p.description || '', defaultLanguage:p.default_language || 'en',
        apartments: links.filter((l: any) => l.user_id === p.id).map((l: any) => apartmentMap.get(Number(l.apartment_id))).filter(Boolean) as string[], updatedAt:p.updated_at || null,
      })));
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const sendPasswordSetup = async (owner: Owner) => {
    if (!owner.email) return;
    setSending(owner.id);
    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await supabase.auth.resetPasswordForEmail(owner.email, { redirectTo });
      if (error) throw error;
      alert(t.sent);
    } catch { alert(t.error); }
    finally { setSending(null); }
  };

  return <div className="space-y-6">
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex items-start justify-between"><div><h2 className="text-xl font-bold text-slate-900">{t.title}</h2><p className="text-xs text-slate-500 mt-1">{t.subtitle}</p></div><button onClick={()=>void load()} className="p-2 border rounded-lg text-slate-600 hover:bg-slate-50"><RefreshCw className="w-4 h-4"/></button></div>
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 border-b"><tr><th className="px-5 py-3 text-left font-bold text-slate-600">{t.name}</th><th className="px-5 py-3 text-left font-bold text-slate-600">{t.email}</th><th className="px-5 py-3 text-left font-bold text-slate-600">{t.phone}</th><th className="px-5 py-3 text-left font-bold text-slate-600">{t.apartments}</th><th className="px-5 py-3 text-left font-bold text-slate-600">{t.description}</th>{canManage&&<th className="px-5 py-3 text-right font-bold text-slate-600"> </th>}</tr></thead><tbody className="divide-y">{loading?<tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">…</td></tr>:owners.map(owner=><tr key={owner.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold text-slate-900">{owner.firstName} {owner.lastName}</td><td className="px-5 py-4 text-slate-600">{owner.email}</td><td className="px-5 py-4 text-slate-600">{owner.phone || '—'}</td><td className="px-5 py-4 text-slate-600">{owner.apartments.join(', ') || '—'}</td><td className="px-5 py-4 text-slate-600">{owner.description || '—'}</td>{canManage&&<td className="px-5 py-4 text-right"><button disabled={sending===owner.id} onClick={()=>void sendPasswordSetup(owner)} className="px-3 py-1.5 border border-teal-200 text-teal-800 rounded-lg text-xs font-bold disabled:opacity-50"><Mail className="inline w-3.5 h-3.5 mr-1"/>{sending===owner.id?'…':t.send}</button></td>}</tr>)}{!loading&&!owners.length&&<tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">{t.empty}</td></tr>}</tbody></table></div></div>
  </div>;
};
