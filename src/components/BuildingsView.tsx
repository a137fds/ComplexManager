import React, { useState } from 'react';
import {
  Layers,
  Home,
  UserCheck,
  FileText,
  Plus,
  Edit2,
  Phone,
  CheckCircle,
  Thermometer,
  ArrowUpRight
} from 'lucide-react';
import { Building, UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

interface BuildingsViewProps {
  buildings: Building[];
  onUpdateBuilding: (building: Building) => void;
  onAddBuilding: (building: Building) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const BuildingsView: React.FC<BuildingsViewProps> = ({
  buildings,
  onUpdateBuilding,
  onAddBuilding,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];
  const canManage = ['admin', 'management_company', 'chairman'].includes(currentRole);

  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newBlock, setNewBlock] = useState<Partial<Building>>({
    blockCode: 'Block D',
    name: 'Palmiye Blok',
    totalFloors: 6,
    totalUnits: 16,
    occupiedUnits: 16,
    caretakerName: 'Mehmet Yılmaz',
    caretakerPhone: '+90 532 555 0192',
    elevatorCount: 2,
    heatingType: 'Individual VRF / Multi-Split Heat Pump',
    photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'],
    documentsCount: 2,
    notes: 'Newly added residential block.'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlock.blockCode || !newBlock.name) return;

    const created: Building = {
      id: `bld-${Date.now()}`,
      blockCode: newBlock.blockCode || 'Block D',
      name: newBlock.name || 'New Block',
      totalFloors: Number(newBlock.totalFloors) || 6,
      totalUnits: Number(newBlock.totalUnits) || 16,
      occupiedUnits: Number(newBlock.occupiedUnits) || 16,
      caretakerName: newBlock.caretakerName || 'Mehmet Yılmaz',
      caretakerPhone: newBlock.caretakerPhone || '+90 532 555 0192',
      elevatorCount: Number(newBlock.elevatorCount) || 2,
      heatingType: newBlock.heatingType || 'Multi-Split Heat Pump',
      photos: newBlock.photos || [],
      documentsCount: 1,
      notes: newBlock.notes || ''
    };

    onAddBuilding(created);
    setIsAddingNew(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuilding) {
      onUpdateBuilding(editingBuilding);
      setEditingBuilding(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.buildingsTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.buildingsSubtitle}</p>
        </div>
        {canManage && (
          <button
            id="add-building-btn"
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t.addBuilding}
          </button>
        )}
      </div>

      {/* Buildings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buildings.map((building) => {
          const occupancy = Math.round((building.occupiedUnits / building.totalUnits) * 100);
          return (
            <div
              key={building.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Photo banner */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={building.photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt={building.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {building.blockCode}
                  </div>
                  <div className="absolute top-3 right-3 bg-teal-600/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    {building.totalUnits} Units
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{building.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{building.notes}</p>
                  </div>

                  {/* Quick specs grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-600 block">{t.floorsCount}</span>
                      <span className="font-bold text-slate-800">{building.totalFloors} Floors</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">{t.occupancyRate}</span>
                      <span className="font-bold text-teal-700">{occupancy}% ({building.occupiedUnits}/{building.totalUnits})</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Elevators</span>
                      <span className="font-bold text-slate-800">{building.elevatorCount} Certified</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Heating</span>
                      <span className="font-bold text-slate-800">VRF Multi-Split</span>
                    </div>
                  </div>

                  {/* Caretaker / Kapıcı badge */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-orange-700 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">{building.caretakerName}</div>
                        <div className="text-[11px] text-orange-800">{building.caretakerPhone}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-white text-[10px] font-bold text-orange-800 rounded-md border border-orange-200">
                      Kapıcı
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {building.documentsCount} Tech Docs
                </span>
                {canManage && (
                  <button
                    onClick={() => setEditingBuilding(building)}
                    className="text-teal-700 hover:text-teal-900 font-bold inline-flex items-center"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    {t.edit}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Building Modal */}
      {editingBuilding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Edit {editingBuilding.blockCode} ({editingBuilding.name})
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Block Name</label>
                <input
                  type="text"
                  value={editingBuilding.name}
                  onChange={(e) => setEditingBuilding({ ...editingBuilding, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Floors</label>
                  <input
                    type="number"
                    value={editingBuilding.totalFloors}
                    onChange={(e) => setEditingBuilding({ ...editingBuilding, totalFloors: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Units</label>
                  <input
                    type="number"
                    value={editingBuilding.totalUnits}
                    onChange={(e) => setEditingBuilding({ ...editingBuilding, totalUnits: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caretaker Name</label>
                <input
                  type="text"
                  value={editingBuilding.caretakerName}
                  onChange={(e) => setEditingBuilding({ ...editingBuilding, caretakerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caretaker Phone</label>
                <input
                  type="text"
                  value={editingBuilding.caretakerPhone}
                  onChange={(e) => setEditingBuilding({ ...editingBuilding, caretakerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Description</label>
                <textarea
                  rows={2}
                  value={editingBuilding.notes}
                  onChange={(e) => setEditingBuilding({ ...editingBuilding, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBuilding(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Building Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              {t.addBuilding}
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Block Code</label>
                  <input
                    type="text"
                    value={newBlock.blockCode}
                    onChange={(e) => setNewBlock({ ...newBlock, blockCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    placeholder="e.g. Block D"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Block Name</label>
                  <input
                    type="text"
                    value={newBlock.name}
                    onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    placeholder="e.g. Palmiye Blok"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Floors</label>
                  <input
                    type="number"
                    value={newBlock.totalFloors}
                    onChange={(e) => setNewBlock({ ...newBlock, totalFloors: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Units</label>
                  <input
                    type="number"
                    value={newBlock.totalUnits}
                    onChange={(e) => setNewBlock({ ...newBlock, totalUnits: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caretaker</label>
                <input
                  type="text"
                  value={newBlock.caretakerName}
                  onChange={(e) => setNewBlock({ ...newBlock, caretakerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newBlock.notes}
                  onChange={(e) => setNewBlock({ ...newBlock, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold"
                >
                  {t.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
