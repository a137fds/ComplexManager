import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Landmark,
  FileCheck2,
  Calendar,
  Layers,
  Phone,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Clock,
  User,
  AlertTriangle,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ComplexEntity, BuildingEntity } from '../api/databaseApi';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

interface ComplexViewProps {
  complexes: ComplexEntity[];
  selectedComplexId: number | null;
  onSelectComplex: (id: number) => void;
  onCreateComplex: (data: { ComplexName: string; Address: string; ChangeUserID?: string }) => Promise<void>;
  onUpdateComplex: (id: number, data: { ComplexName: string; Address: string; ChangeUserID?: string }) => Promise<void>;
  onDeleteComplex: (id: number) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
  buildings: BuildingEntity[];
  onNavigateToBuildings?: (complexId?: number) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const ComplexView: React.FC<ComplexViewProps> = ({
  complexes,
  selectedComplexId,
  onSelectComplex,
  onCreateComplex,
  onUpdateComplex,
  onDeleteComplex,
  onRefresh,
  loading,
  buildings,
  onNavigateToBuildings,
  currentRole,
  currentLang,
}) => {
  const t = translations[currentLang];
  const canManage = ['admin', 'management_company', 'chairman', 'board_member'].includes(currentRole);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingComplex, setEditingComplex] = useState<ComplexEntity | null>(null);
  const [deletingComplex, setDeletingComplex] = useState<ComplexEntity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    ComplexName: '',
    Address: '',
    ChangeUserID: currentRole || 'admin_user',
  });

  const [editForm, setEditForm] = useState({
    ComplexName: '',
    Address: '',
    ChangeUserID: '',
  });

  // Current active complex record from PostgreSQL
  const activeComplex = complexes.find((c) => c.ComplexID === selectedComplexId) || complexes[0] || null;

  // Filter child buildings for active complex
  const activeBuildings = activeComplex
    ? buildings.filter((b) => b.ComplexID === activeComplex.ComplexID)
    : [];

  const handleOpenEdit = (complex: ComplexEntity) => {
    setEditingComplex(complex);
    setEditForm({
      ComplexName: complex.ComplexName,
      Address: complex.Address,
      ChangeUserID: currentRole || complex.ChangeUserID || 'admin_user',
    });
    setFormError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.ComplexName.trim()) {
      setFormError('Complex name is required');
      return;
    }
    if (!addForm.Address.trim()) {
      setFormError('Address is required');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await onCreateComplex({
        ComplexName: addForm.ComplexName.trim(),
        Address: addForm.Address.trim(),
        ChangeUserID: addForm.ChangeUserID || currentRole || 'admin_user',
      });
      setIsAddModalOpen(false);
      setAddForm({
        ComplexName: '',
        Address: '',
        ChangeUserID: currentRole || 'admin_user',
      });
    } catch (err: any) {
      setFormError(err.message || 'Failed to create complex');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplex) return;
    if (!editForm.ComplexName.trim()) {
      setFormError('Complex name is required');
      return;
    }
    if (!editForm.Address.trim()) {
      setFormError('Address is required');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await onUpdateComplex(editingComplex.ComplexID, {
        ComplexName: editForm.ComplexName.trim(),
        Address: editForm.Address.trim(),
        ChangeUserID: editForm.ChangeUserID || currentRole || 'admin_user',
      });
      setEditingComplex(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update complex');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingComplex) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await onDeleteComplex(deletingComplex.ComplexID);
      setDeletingComplex(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to delete complex');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & PostgreSQL Registry Toolbar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">{t.complexTitle}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              PostgreSQL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time residential complex records stored in PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="refresh-complexes-btn"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {canManage && (
            <button
              id="add-complex-btn"
              onClick={() => {
                setIsAddModalOpen(true);
                setFormError(null);
              }}
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Complex
            </button>
          )}
        </div>
      </div>

      {/* Complexes Selector Bar (if multiple or to switch active complex) */}
      {complexes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Registered Complexes ({complexes.length})
            </span>
            <span className="text-xs text-slate-400">Click to inspect / manage</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {complexes.map((c) => {
              const isSelected = activeComplex?.ComplexID === c.ComplexID;
              const childCount = buildings.filter((b) => b.ComplexID === c.ComplexID).length;
              return (
                <div
                  key={c.ComplexID}
                  onClick={() => onSelectComplex(c.ComplexID)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono text-[11px] font-bold text-slate-700">
                          ID: {c.ComplexID}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{c.ComplexName}</h4>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        {childCount} {childCount === 1 ? 'Building' : 'Buildings'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                      {c.Address}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(c.ChangeDate).toLocaleDateString()}
                    </span>

                    {canManage && (
                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1 text-slate-500 hover:text-teal-600 rounded hover:bg-slate-100"
                          title="Edit Complex"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingComplex(c)}
                          className="p-1 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100"
                          title="Delete Complex"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Complex Detailed Specification View */}
      {activeComplex ? (
        <div className="space-y-6">
          {/* Hero Banner with Live PostgreSQL Record Details */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md p-6 sm:p-8 text-white">
            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>PostgreSQL Complex Record</span>
                  </span>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10">
                    ComplexID: {activeComplex.ComplexID}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {activeComplex.ComplexName}
                </h2>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-300">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-teal-400 shrink-0" />
                    {activeComplex.Address}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                  <span className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Last changed by: <strong className="text-slate-200 ml-1">{activeComplex.ChangeUserID || 'system'}</strong>
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Last updated: <strong className="text-slate-200 ml-1">{new Date(activeComplex.ChangeDate).toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {canManage && (
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    id="edit-active-complex-btn"
                    onClick={() => handleOpenEdit(activeComplex)}
                    className="inline-flex items-center px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Edit Record
                  </button>
                  <button
                    id="delete-active-complex-btn"
                    onClick={() => setDeletingComplex(activeComplex)}
                    className="inline-flex items-center px-3.5 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Database Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1: Structural Info & Building Count */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-teal-700">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200">
                    <Layers className="w-5 h-5 text-teal-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{t.totalBlocksLabel}</h3>
                </div>
                {onNavigateToBuildings && (
                  <button
                    onClick={() => onNavigateToBuildings(activeComplex.ComplexID)}
                    className="text-xs text-teal-700 hover:text-teal-900 font-bold inline-flex items-center"
                  >
                    Manage Blocks
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-600 font-semibold">Associated Buildings</span>
                <p className="text-3xl font-black text-slate-900 mt-1">{activeBuildings.length} Blocks</p>
                <span className="text-xs text-teal-700 font-medium mt-1 block">
                  {activeBuildings.map((b) => b.BuildingName).join(', ') || 'No building blocks registered'}
                </span>
              </div>
            </div>

            {/* Metric 2: Registry & System Audit */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center space-x-3 text-teal-700">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200">
                  <FileCheck2 className="w-5 h-5 text-teal-700" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Database Audit</h3>
              </div>
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Complex ID:</span>
                  <span className="font-mono font-bold text-slate-900">{activeComplex.ComplexID}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Change User ID:</span>
                  <span className="font-mono font-semibold text-slate-900">{activeComplex.ChangeUserID || 'system'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 font-medium">Change Date:</span>
                  <span className="font-semibold text-slate-900">{new Date(activeComplex.ChangeDate).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Metric 3: Address & Location Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center space-x-3 text-teal-700">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200">
                  <Landmark className="w-5 h-5 text-teal-700" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Location Registry</h3>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">Registered Postal Address</span>
                <p className="font-medium text-slate-900 leading-relaxed">{activeComplex.Address}</p>
              </div>
            </div>
          </div>

          {/* Child Buildings List for Active Complex */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Buildings Belonging to {activeComplex.ComplexName} ({activeBuildings.length})
                </h3>
              </div>
              {onNavigateToBuildings && (
                <button
                  onClick={() => onNavigateToBuildings(activeComplex.ComplexID)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center"
                >
                  View All in Buildings Tab
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              )}
            </div>

            {activeBuildings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeBuildings.map((b) => (
                  <div key={b.BuildingID} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{b.BuildingName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">BuildingID: {b.BuildingID}</div>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(b.ChangeDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No buildings have been created for this complex yet. Go to the Buildings tab to add building blocks.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
          <Landmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Complex Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no complex records in the database. Click "Add Complex" to create the first record.
          </p>
          {canManage && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add First Complex
            </button>
          )}
        </div>
      )}

      {/* Add Complex Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add New Complex</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complex Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.ComplexName}
                  onChange={(e) => setAddForm({ ...addForm, ComplexName: e.target.value })}
                  placeholder="e.g. Akdeniz Royal Residence"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={addForm.Address}
                  onChange={(e) => setAddForm({ ...addForm, Address: e.target.value })}
                  placeholder="e.g. Mahmutlar Mah. Barbaros Cad. No: 142, Alanya / Antalya"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change User ID
                </label>
                <input
                  type="text"
                  value={addForm.ChangeUserID}
                  onChange={(e) => setAddForm({ ...addForm, ChangeUserID: e.target.value })}
                  placeholder="admin_user"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={submitting}
                  className="px-3.5 py-2 text-xs text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-xs flex items-center"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Create Complex'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Complex Modal */}
      {editingComplex && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Edit Complex (ID: {editingComplex.ComplexID})
              </h3>
              <button
                onClick={() => setEditingComplex(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complex Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.ComplexName}
                  onChange={(e) => setEditForm({ ...editForm, ComplexName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editForm.Address}
                  onChange={(e) => setEditForm({ ...editForm, Address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change User ID
                </label>
                <input
                  type="text"
                  value={editForm.ChangeUserID}
                  onChange={(e) => setEditForm({ ...editForm, ChangeUserID: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingComplex(null)}
                  disabled={submitting}
                  className="px-3.5 py-2 text-xs text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-xs flex items-center"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Complex Confirmation Modal */}
      {deletingComplex && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600 pb-3 border-b border-slate-200">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900">{deletingComplex.ComplexName}</strong> (ID: {deletingComplex.ComplexID})?
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
                <span className="font-bold flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-1 text-red-600" />
                  Cascade Delete Warning:
                </span>
                <p>
                  Deleting this complex will also permanently delete all associated buildings in PostgreSQL.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeletingComplex(null)}
                disabled={submitting}
                className="px-3.5 py-2 text-xs text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-4 py-2 text-xs bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-xs flex items-center"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete Complex'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
