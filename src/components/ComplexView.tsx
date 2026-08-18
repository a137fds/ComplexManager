import React, { useState } from 'react';
import { Building2, MapPin, Landmark, FileCheck2, Calendar, Layers, Phone, Edit2, Trash2, Plus, RefreshCw, X, ArrowRight, ShieldAlert, AlertTriangle } from 'lucide-react';
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

type FormData = { ComplexName: string; Address: string };

export const ComplexView: React.FC<ComplexViewProps> = ({
  complexes, selectedComplexId, onSelectComplex, onCreateComplex, onUpdateComplex,
  onDeleteComplex, onRefresh, loading, buildings, onNavigateToBuildings, currentRole, currentLang,
}) => {
  const t = translations[currentLang];
  const canManage = ['admin', 'management_company', 'chairman', 'board_member'].includes(currentRole);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<ComplexEntity | null>(null);
  const [deleting, setDeleting] = useState<ComplexEntity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<FormData>({ ComplexName: '', Address: '' });
  const [editForm, setEditForm] = useState<FormData>({ ComplexName: '', Address: '' });
  const [editOriginal, setEditOriginal] = useState<FormData>({ ComplexName: '', Address: '' });

  const activeComplex = complexes.find((c) => c.ComplexID === selectedComplexId) ?? complexes[0] ?? null;
  const activeBuildings = activeComplex ? buildings.filter((b) => b.ComplexID === activeComplex.ComplexID) : [];
  const editDirty = !!editing && (
    editForm.ComplexName.trim() !== editOriginal.ComplexName ||
    editForm.Address.trim() !== editOriginal.Address
  );

  const closeModals = () => {
    if (!submitting) {
      setAddOpen(false);
      setEditing(null);
      setDeleting(null);
      setError(null);
    }
  };

  const openEdit = (complex: ComplexEntity) => {
    const data = { ComplexName: complex.ComplexName ?? '', Address: complex.Address ?? '' };
    setEditing(complex);
    setEditForm(data);
    setEditOriginal(data);
    setError(null);
  };

  const submitAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!addForm.ComplexName.trim()) return setError('Complex name is required');
    if (!addForm.Address.trim()) return setError('Address is required');
    setSubmitting(true);
    setError(null);
    try {
      await onCreateComplex({ ComplexName: addForm.ComplexName.trim(), Address: addForm.Address.trim() });
      setAddOpen(false);
      setAddForm({ ComplexName: '', Address: '' });
    } catch (err: any) {
      setError(err?.message || 'Failed to create complex');
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing || !editDirty) return;
    if (!editForm.ComplexName.trim()) return setError('Complex name is required');
    if (!editForm.Address.trim()) return setError('Address is required');
    setSubmitting(true);
    setError(null);
    try {
      await onUpdateComplex(editing.ComplexID, {
        ComplexName: editForm.ComplexName.trim(),
        Address: editForm.Address.trim(),
      });
      setEditing(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update complex');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onDeleteComplex(deleting.ComplexID);
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete complex');
    } finally {
      setSubmitting(false);
    }
  };

  const Modal = ({ title, subtitle, children, footer, onClose }: {
    title: string; subtitle?: string; children: React.ReactNode; footer: React.ReactNode; onClose: () => void;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={submitting} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
        <div className="flex justify-end gap-2 border-t border-slate-100 p-6">{footer}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-slate-900">{t.complexTitle}</h2>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} disabled={loading} className="rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {canManage && (
            <button onClick={() => { setAddOpen(true); setError(null); }} className="inline-flex items-center rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500">
              <Plus className="mr-1.5 h-4 w-4" />Add Complex
            </button>
          )}
        </div>
      </div>

      {complexes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Complexes ({complexes.length})</span>
            <span className="text-xs text-slate-400">Click to inspect / manage</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {complexes.map((complex) => (
              <button key={complex.ComplexID} onClick={() => onSelectComplex(complex.ComplexID)} className={`flex items-center space-x-2 whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold ${selectedComplexId === complex.ComplexID ? 'border-teal-300 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'}`}>
                <Building2 className="h-4 w-4" />{complex.ComplexName}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeComplex ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs lg:col-span-2">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{activeComplex.ComplexName}</h3>
                  <div className="mt-2 flex items-center text-slate-500"><MapPin className="mr-2 h-4 w-4" />{activeComplex.Address}</div>
                </div>
                {canManage && <div className="flex gap-2"><button onClick={() => openEdit(activeComplex)} title="Edit" className="rounded-lg p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => { setDeleting(activeComplex); setError(null); }} title="Delete" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4"><div className="mb-1 flex items-center text-xs text-slate-500"><Layers className="mr-1 h-3 w-3" />Buildings</div><div className="text-2xl font-bold text-slate-900">{activeBuildings.length}</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="mb-1 flex items-center text-xs text-slate-500"><Phone className="mr-1 h-3 w-3" />Contact</div><div className="text-sm font-bold text-slate-900">N/A</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="mb-1 flex items-center text-xs text-slate-500"><FileCheck2 className="mr-1 h-3 w-3" />Status</div><div className="text-sm font-bold text-emerald-600">Active</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><div className="mb-1 flex items-center text-xs text-slate-500"><Calendar className="mr-1 h-3 w-3" />Last change</div><div className="text-sm font-bold text-slate-900">{activeComplex.ChangeDate ? new Date(activeComplex.ChangeDate).toLocaleDateString() : 'N/A'}</div></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="mb-4 flex items-center space-x-2"><Landmark className="h-5 w-5 text-teal-600" /><h3 className="font-bold text-slate-900">Buildings</h3></div>
            {activeBuildings.length === 0 ? <div className="py-8 text-center text-slate-400"><Building2 className="mx-auto mb-2 h-8 w-8 opacity-50" /><p className="text-sm">No buildings registered.</p></div> : <div className="space-y-2">{activeBuildings.map((building) => <div key={building.BuildingID} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="font-semibold text-slate-800">{building.BuildingName}</div><div className="text-xs text-slate-500">{building.Address || activeComplex.Address}</div></div>)}</div>}
            {onNavigateToBuildings && <button onClick={() => onNavigateToBuildings(activeComplex.ComplexID)} className="mt-4 flex w-full items-center justify-center space-x-2 text-sm font-bold text-teal-600"><span>Manage buildings</span><ArrowRight className="h-4 w-4" /></button>}
          </div>
        </div>
      ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><Building2 className="mx-auto mb-3 h-10 w-10 text-slate-300" /><h3 className="font-bold text-slate-700">No complexes found</h3></div>}

      {addOpen && <Modal title="Add New Complex" subtitle="Create a new residential complex record." onClose={closeModals} footer={<><button type="button" onClick={closeModals} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600">Cancel</button><button type="submit" form="add-complex-form" disabled={submitting} className="rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white disabled:opacity-40">{submitting ? 'Saving...' : 'Save'}</button></>}><form id="add-complex-form" onSubmit={submitAdd} className="space-y-4 p-6"><label className="block"><span className="text-sm font-semibold text-slate-700">Complex Name *</span><input value={addForm.ComplexName} onChange={(e) => setAddForm({ ...addForm, ComplexName: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="block"><span className="text-sm font-semibold text-slate-700">Address *</span><input value={addForm.Address} onChange={(e) => setAddForm({ ...addForm, Address: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>{error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"><AlertTriangle className="h-4 w-4" />{error}</div>}</form></Modal>}

      {editing && <Modal title="Edit Complex" subtitle="Update residential complex record." onClose={closeModals} footer={<><button type="button" onClick={closeModals} disabled={submitting} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600">Cancel</button><button type="submit" form="edit-complex-form" disabled={submitting || !editDirty} className="rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white disabled:opacity-40">{submitting ? 'Saving...' : 'Save'}</button></>}><form id="edit-complex-form" onSubmit={submitEdit} className="space-y-4 p-6"><label className="block"><span className="text-sm font-semibold text-slate-700">Complex Name *</span><input value={editForm.ComplexName} onChange={(e) => setEditForm({ ...editForm, ComplexName: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="block"><span className="text-sm font-semibold text-slate-700">Address *</span><input value={editForm.Address} onChange={(e) => setEditForm({ ...editForm, Address: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>{error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}</form></Modal>}

      {deleting && <Modal title="Delete Complex" subtitle="This action cannot be undone." onClose={closeModals} footer={<><button type="button" onClick={closeModals} disabled={submitting} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-600">Cancel</button><button type="button" onClick={() => void confirmDelete()} disabled={submitting} className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-40">{submitting ? 'Deleting...' : 'Delete'}</button></>}><div className="space-y-4 p-6"><div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"><ShieldAlert className="h-5 w-5 shrink-0 text-red-600" /><div><div className="font-semibold text-red-800">Are you sure?</div><div className="mt-1 text-sm text-red-700">The complex and its data may be permanently removed.</div></div></div>{error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}</div></Modal>}
    </div>
  );
};
