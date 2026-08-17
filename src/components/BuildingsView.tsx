import React, { useState } from 'react';
import {
  Layers,
  Building2,
  MapPin,
  User,
  Clock,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { BuildingEntity, ComplexEntity } from '../api/databaseApi';
import { UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

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

export const BuildingsView: React.FC<BuildingsViewProps> = ({
  buildings,
  complexes,
  selectedComplexFilter,
  onSelectComplexFilter,
  onCreateBuilding,
  onUpdateBuilding,
  onDeleteBuilding,
  onRefresh,
  loading,
  currentRole,
  currentLang,
}) => {
  const t = translations[currentLang];
  const canManage = ['admin', 'management_company', 'chairman', 'board_member'].includes(currentRole);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingEntity | null>(null);
  const [deletingBuilding, setDeletingBuilding] = useState<BuildingEntity | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    ComplexID: complexes[0]?.ComplexID || 1,
    BuildingName: '',
  });

  const [editForm, setEditForm] = useState({
    ComplexID: 1,
    BuildingName: '',
  });

  // Filter buildings by selected complex and search term
  const filteredBuildings = buildings.filter((building) => {
    const matchesComplex =
      selectedComplexFilter === 'all' || building.ComplexID === selectedComplexFilter;
    const matchesSearch =
      !searchTerm ||
      building.BuildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(building.BuildingID).includes(searchTerm) ||
      (building.ComplexName && building.ComplexName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesComplex && matchesSearch;
  });

  const handleOpenAdd = () => {
    const defaultComplexId =
      selectedComplexFilter !== 'all'
        ? selectedComplexFilter
        : complexes[0]?.ComplexID || 1;
    setAddForm({
      ComplexID: defaultComplexId,
      BuildingName: '',
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (building: BuildingEntity) => {
    setEditingBuilding(building);
    setEditForm({
      ComplexID: building.ComplexID,
      BuildingName: building.BuildingName,
    });
    setFormError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.BuildingName.trim()) {
      setFormError('Building name is required');
      return;
    }
    if (!addForm.ComplexID) {
      setFormError('Parent complex must be selected');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await onCreateBuilding({
        ComplexID: Number(addForm.ComplexID),
        BuildingName: addForm.BuildingName.trim(),
      });
      setIsAddModalOpen(false);
      setAddForm({
        ComplexID: complexes[0]?.ComplexID || 1,
        BuildingName: '',
      });
    } catch (err: any) {
      setFormError(err.message || 'Failed to create building');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBuilding) return;
    if (!editForm.BuildingName.trim()) {
      setFormError('Building name is required');
      return;
    }
    if (!editForm.ComplexID) {
      setFormError('Parent complex must be selected');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await onUpdateBuilding(editingBuilding.BuildingID, {
        ComplexID: Number(editForm.ComplexID),
        BuildingName: editForm.BuildingName.trim(),
      });
      setEditingBuilding(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update building');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBuilding) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await onDeleteBuilding(deletingBuilding.BuildingID);
      setDeletingBuilding(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to delete building');
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
            <h2 className="text-xl font-bold text-slate-900">{t.buildingsTitle}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              PostgreSQL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered building blocks and relational hierarchies stored in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="refresh-buildings-btn"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {canManage && (
            <button
              id="add-building-btn"
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {t.addBuilding}
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search buildings by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter by Complex */}
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Complex:</span>
          <select
            id="complex-filter-select"
            value={selectedComplexFilter}
            onChange={(e) =>
              onSelectComplexFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Complexes ({buildings.length} total blocks)</option>
            {complexes.map((c) => {
              const bCount = buildings.filter((b) => b.ComplexID === c.ComplexID).length;
              return (
                <option key={c.ComplexID} value={c.ComplexID}>
                  {c.ComplexName} ({bCount} blocks)
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Buildings Cards Grid */}
      {filteredBuildings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => {
            const parentComplex = complexes.find((c) => c.ComplexID === building.ComplexID);
            return (
              <div
                key={building.BuildingID}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header & Block Banner */}
                  <div className="p-5 pb-4 border-b border-slate-100 bg-linear-to-b from-slate-50/70 to-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 font-mono text-[11px] font-bold text-teal-800">
                            BuildingID: {building.BuildingID}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono text-[11px] font-semibold text-slate-600">
                            ComplexID: {building.ComplexID}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                          {building.BuildingName}
                        </h3>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 space-y-3.5 text-xs">
                    {/* Parent Complex Link */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center space-x-1.5 text-slate-500 font-semibold text-[10px] uppercase">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Parent Complex</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">
                        {building.ComplexName || parentComplex?.ComplexName || `Complex #${building.ComplexID}`}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 flex items-center pt-0.5">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                        {building.Address || parentComplex?.Address || 'Registered site address'}
                      </div>
                    </div>

                    {/* Audit Metadata */}
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center">
                          <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          Last changed by:
                        </span>
                        <span className="font-mono font-bold text-slate-700">
                          {building.ChangeUserID || 'system'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          Record timestamp:
                        </span>
                        <span className="font-medium text-slate-700">
                          {new Date(building.ChangeDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                {canManage && (
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(building)}
                      className="inline-flex items-center px-3 py-1.5 text-xs text-slate-700 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 rounded-lg font-bold transition-colors"
                      title="Edit Building"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      {t.edit}
                    </button>
                    <button
                      onClick={() => setDeletingBuilding(building)}
                      className="inline-flex items-center px-3 py-1.5 text-xs text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 rounded-lg font-bold transition-colors"
                      title="Delete Building"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      {t.delete}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Buildings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || selectedComplexFilter !== 'all'
              ? 'No buildings match your active search or filter criteria.'
              : 'There are currently no building blocks in the database. Click below to add the first building.'}
          </p>
          {canManage && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {t.addBuilding}
            </button>
          )}
        </div>
      )}

      {/* Add Building Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Building Block</h3>
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
                  Parent Complex <span className="text-red-500">*</span>
                </label>
                <select
                  value={addForm.ComplexID}
                  onChange={(e) => setAddForm({ ...addForm, ComplexID: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                  required
                >
                  {complexes.map((c) => (
                    <option key={c.ComplexID} value={c.ComplexID}>
                      ID #{c.ComplexID} - {c.ComplexName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Building / Block Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.BuildingName}
                  onChange={(e) => setAddForm({ ...addForm, BuildingName: e.target.value })}
                  placeholder="e.g. A Blok (West Tower)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
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
                    'Create Building'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Building Modal */}
      {editingBuilding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Edit Building (ID: {editingBuilding.BuildingID})
              </h3>
              <button
                onClick={() => setEditingBuilding(null)}
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
                  Parent Complex <span className="text-red-500">*</span>
                </label>
                <select
                  value={editForm.ComplexID}
                  onChange={(e) => setEditForm({ ...editForm, ComplexID: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                  required
                >
                  {complexes.map((c) => (
                    <option key={c.ComplexID} value={c.ComplexID}>
                      ID #{c.ComplexID} - {c.ComplexName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Building / Block Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.BuildingName}
                  onChange={(e) => setEditForm({ ...editForm, BuildingName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBuilding(null)}
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

      {/* Delete Building Confirmation Modal */}
      {deletingBuilding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600 pb-3 border-b border-slate-200">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Delete Building Block</h3>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <div className="py-4 space-y-2">
              <p className="text-xs text-slate-700 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-900">{deletingBuilding.BuildingName}</strong> (ID:{' '}
                {deletingBuilding.BuildingID}) from PostgreSQL?
              </p>
              <p className="text-[11px] text-slate-500">
                Parent Complex:{' '}
                <strong>
                  {deletingBuilding.ComplexName || `Complex #${deletingBuilding.ComplexID}`}
                </strong>
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeletingBuilding(null)}
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
                  'Yes, Delete Building'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
