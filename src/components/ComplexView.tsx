import React, { useState } from 'react';
import { Building2, MapPin, Landmark, FileCheck2, Calendar, Layers, Phone, Edit3, Trash2, Plus, RefreshCw, Clock, User, AlertTriangle, X, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { ComplexEntity, BuildingEntity } from '../api/databaseApi';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

interface ComplexViewProps {
  complexes: ComplexEntity[];
  selectedComplexId: number | null;
  onSelectComplex: (id: number) => void;
  onCreateComplex: (data: { ComplexName: string; Address: string }) => Promise<void>;
  onUpdateComplex: (id: number, data: { ComplexName: string; Address: string }) => Promise<void>;
  onDeleteComplex: (id: number) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
  buildings: BuildingEntity[];
  onNavigateToBuildings?: (complexId?: number) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const ComplexView: React.FC<ComplexViewProps> = ({ complexes, selectedComplexId, onSelectComplex, onCreateComplex, onUpdateComplex, onDeleteComplex, onRefresh, loading, buildings, onNavigateToBuildings, currentRole, currentLang }) => {
  const t = translations[currentLang];
  const canManage = ['admin', 'management_company', 'chairman', 'board_member'].includes(currentRole);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingComplex, setEditingComplex] = useState<ComplexEntity | null>(null);
  const [deletingComplex, setDeletingComplex] = useState<ComplexEntity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ ComplexName: '', Address: '' });
  const [editForm, setEditForm] = useState({ ComplexName: '', Address: '' });

  const activeComplex = complexes.find((c) => c.ComplexID === selectedComplexId) || complexes[0] || null;
  const activeBuildings = activeComplex ? buildings.filter((b) => b.ComplexID === activeComplex.ComplexID) : [];

  const handleOpenEdit = (complex: ComplexEntity) => {
    setEditingComplex(complex);
    setEditForm({ ComplexName: complex.ComplexName, Address: complex.Address });
    setFormError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.ComplexName.trim()) return setFormError('Complex name is required');
    if (!addForm.Address.trim()) return setFormError('Address is required');
    setSubmitting(true); setFormError(null);
    try {
      await onCreateComplex({ ComplexName: addForm.ComplexName.trim(), Address: addForm.Address.trim() });
      setIsAddModalOpen(false);
      setAddForm({ ComplexName: '', Address: '' });
    } catch (err: any) { setFormError(err.message || 'Failed to create complex'); }
    finally { setSubmitting(false); }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplex) return;
    if (!editForm.ComplexName.trim()) return setFormError('Complex name is required');
    if (!editForm.Address.trim()) return setFormError('Address is required');
    setSubmitting(true); setFormError(null);
    try {
      await onUpdateComplex(editingComplex.ComplexID, { ComplexName: editForm.ComplexName.trim(), Address: editForm.Address.trim() });
      setEditingComplex(null);
    } catch (err: any) { setFormError(err.message || 'Failed to update complex'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingComplex) return;
    setSubmitting(true); setFormError(null);
    try { await onDeleteComplex(deletingComplex.ComplexID); setDeletingComplex(null); }
    catch (err: any) { setFormError(err.message || 'Failed to delete complex'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2"><h2 className="text-xl font-bold text-slate-900">{t.complexTitle}</h2><span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">PostgreSQL</span></div>
          <p className="text-xs text-slate-500 mt-1">Real-time residential complex records stored in PostgreSQL database.</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button id="refresh-complexes-btn" onClick={onRefresh} disabled={loading} className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors" title="Refresh database records"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          {canManage && <button id="add-complex-btn" onClick={() => { setIsAddModalOpen(true); setFormError(null); }} className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"><Plus className="w-4 h-4 mr-1.5" />Add Complex</button>}
        </div>
      </div>

      {complexes.length > 0 && <div className="space-y-2"><div className="flex items-center justify-between px-1"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Complexes ({complexes.length})</span><span className="text-xs text-slate-400">Click to inspect / manage</span></div><div className="flex gap-2 overflow-x-auto pb-2">{complexes.map((complex) => <button key={complex.ComplexID} onClick={() => onSelectComplex(complex.ComplexID)} className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all ${selectedComplexId === complex.ComplexID ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}><Building2 className="w-4 h-4" />{complex.ComplexName}</button>)}</div></div>}

      {activeComplex ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"><div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white"><div className="flex items-start justify-between"><div><h3 className="text-2xl font-bold text-slate-900">{activeComplex.ComplexName}</h3><div className="flex items-center text-slate-500 mt-2"><MapPin className="w-4 h-4 mr-2" />{activeComplex.Address}</div></div>{canManage && <div className="flex items-center gap-2"><button onClick={() => handleOpenEdit(activeComplex)} className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit3 className="w-4 h-4" /></button><button onClick={() => { setDeletingComplex(activeComplex); setFormError(null); }} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>}</div></div><div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4"><div className="p-4 bg-slate-50 rounded-xl"><div className="flex items-center text-xs text-slate-500 mb-1"><Layers className="w-3 h-3 mr-1" />Buildings</div><div className="text-2xl font-bold text-slate-900">{activeBuildings.length}</div></div><div className="p-4 bg-slate-50 rounded-xl"><div className="flex items-center text-xs text-slate-500 mb-1"><Phone className="w-3 h-3 mr-1" />Contact</div><div className="text-sm font-bold text-slate-900">{t.common.na}</div></div><div className="p-4 bg-slate-50 rounded-xl"><div className="flex items-center text-xs text-slate-500 mb-1"><FileCheck2 className="w-3 h-3 mr-1" />Status</div><div className="text-sm font-bold text-emerald-600">{t.common.active}</div></div><div className="p-4 bg-slate-50 rounded-xl"><div className="flex items-center text-xs text-slate-500 mb-1"><Calendar className="w-3 h-3 mr-1" />Last change</div><div className="text-sm font-bold text-slate-900">{new Date(activeComplex.ChangeDate).toLocaleDateString()}</div></div></div></div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6"><div className="flex items-center space-x-2 mb-4"><Landmark className="w-5 h-5 text-teal-600" /><h3 className="font-bold text-slate-900">Buildings</h3></div>{activeBuildings.length === 0 ? <div className="text-center py-8 text-slate-400"><Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No buildings registered.</p></div> : <div className="space-y-2">{activeBuildings.map((building) => <div key={building.BuildingID} className="p-3 rounded-xl bg-slate-50 border border-slate-100"><div className="font-semibold text-slate-800">{building.BuildingName}</div><div className="text-xs text-slate-500">{building.Address || activeComplex.Address}</div></div>)}</div>}{onNavigateToBuildings && <button onClick={() => onNavigateToBuildings(activeComplex.ComplexID)} className="w-full mt-4 flex items-center justify-center space-x-2 text-sm font-bold text-teal-600 hover:text-teal-700"><span>Manage buildings</span><ArrowRight className="w-4 h-4" /></button>}</div>
      </div> : <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center"><Building2 className="w-10 h-10 mx-auto text-slate-300 mb-3" /><h3 className="font-bold text-slate-700">No complexes found</h3><p className="text-sm text-slate-500 mt-1">Create the first complex to get started.</p></div>}

      {isAddModalOpen && <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"><div className="p-6 border-b border-slate-100 flex items-center justify-between"><div><h3 className="text-lg font-bold text-slate-900">Add New Complex</h3><p className="text-xs text-slate-500 mt-1">Create a new residential complex record.</p></div><button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button></div><form onSubmit={handleAddSubmit} className="p-6 space-y-4"><label className="block"><span className="text-sm font-semibold text-slate-700">Complex Name *</span><input value={addForm.ComplexName} onChange={(e) => setAddForm({ ...addForm, ComplexName: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Complex name" /></label><label className="block"><span className="text-sm font-semibold text-slate-700">Address *</span><input value={addForm.Address} onChange={(e) => setAddForm({ ...addForm, Address: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Address" /></label>{formError && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3"><AlertTriangle className="w-4 h-4 shrink-0" />{formError}</div>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold disabled:opacity-50">{submitting ? 'Creating...' : 'Create Complex'}</button></div></form></div></div>}

      {editingComplex && <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"><div className="p-6 border-b border-slate-100 flex items-center justify-between"><div><h3 className="text-lg font-bold text-slate-900">Edit Complex</h3><p className="text-xs text-slate-500 mt-1">Update residential complex record.</p></div><button onClick={() => setEditingComplex(null)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button></div><form onSubmit={handleEditSubmit} className="p-6 space-y-4"><label className="block"><span className="text-sm font-semibold text-slate-700">Complex Name *</span><input value={editForm.ComplexName} onChange={(e) => setEditForm({ ...editForm, ComplexName: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" /></label><label className="block"><span className="text-sm font-semibold text-slate-700">Address *</span><input value={editForm.Address} onChange={(e) => setEditForm({ ...editForm, Address: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" /> </label>{formError && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{formError}</div>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setEditingComplex(null)} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold disabled:opacity-50">{submitting ? 'Saving...' : 'Save Changes'}</button></div></form></div></div>}

      {deletingComplex && <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"><div className="p-6 border-b border-slate-100 flex items-center justify-between"><div><h3 className="text-lg font-bold text-slate-900">Delete Complex</h3><p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p></div><button onClick={() => setDeletingComplex(null)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button></div><div className="p-6 space-y-4"><div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200"><ShieldAlert className="w-5 h-5 text-red-600 shrink-0" /><div><div className="font-semibold text-red-800">Are you sure?</div><div className="text-sm text-red-700 mt-1">The complex and its data may be permanently removed.</div></div></div>{formError && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{formError}</div>}<div className="flex justify-end gap-3"><button onClick={() => setDeletingComplex(null)} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600">Cancel</button><button onClick={handleDeleteConfirm} disabled={submitting} className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold disabled:opacity-50">{submitting ? 'Deleting...' : 'Delete Complex'}</button></div></div></div></div>}
    </div>
  );
};