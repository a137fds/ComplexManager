import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Building2,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Server,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Sparkles,
  Link as LinkIcon,
  ChevronRight,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { databaseApi, ComplexEntity, BuildingEntity } from '../api/databaseApi';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Language } from '../types';

interface CloudSqlCrudViewProps {
  currentLang: Language;
  onAuditLog?: (action: string, targetType: string, targetId: string, details: string) => void;
}

export const CloudSqlCrudView: React.FC<CloudSqlCrudViewProps> = ({
  currentLang,
  onAuditLog,
}) => {
  // Navigation subtabs inside CRUD View
  const [activeTab, setActiveTab] = useState<'overview' | 'complexes' | 'buildings' | 'relations'>('complexes');

  // Live Database States
  const [complexes, setComplexes] = useState<ComplexEntity[]>([]);
  const [buildings, setBuildings] = useState<BuildingEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedComplexFilter, setSelectedComplexFilter] = useState<number | 'all'>('all');

  // Modals / Form State
  const [isComplexModalOpen, setIsComplexModalOpen] = useState<boolean>(false);
  const [editingComplex, setEditingComplex] = useState<ComplexEntity | null>(null);
  const [complexForm, setComplexForm] = useState({
    complexName: '',
    address: '',
    changeUserId: '',
  });

  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState<boolean>(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingEntity | null>(null);
  const [buildingForm, setBuildingForm] = useState({
    complexId: '',
    buildingName: '',
    changeUserId: '',
  });

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'complex' | 'building';
    id: number;
    name: string;
    childCount?: number;
  } | null>(null);

  // Relation Detail Inspector State
  const [inspectComplexId, setInspectComplexId] = useState<number | null>(null);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all live data from PostgreSQL Cloud SQL
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [complexesData, buildingsData] = await Promise.all([
        databaseApi.getComplexes(),
        databaseApi.getBuildings(),
      ]);
      setComplexes(complexesData);
      setBuildings(buildingsData);
      if (complexesData.length > 0 && !inspectComplexId) {
        setInspectComplexId(complexesData[0].complexId);
      }
    } catch (err: any) {
      console.error('Failed to load Cloud SQL data:', err);
      setError(err.message || 'Failed to connect to PostgreSQL Cloud SQL instance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Show temporary action feedback
  const notifySuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => {
      setActionSuccess(null);
    }, 4000);
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
      notifySuccess('Authenticated with Google Firebase Auth');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      notifySuccess('Signed out of session');
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Seed Initial Demo Records
  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await databaseApi.seedDemo();
      notifySuccess(res.message || 'Initial demo complexes and buildings populated in Cloud SQL!');
      await fetchAllData();
      if (onAuditLog) {
        onAuditLog('SEED_DATABASE', 'cloudsql', 'init', 'Populated initial Complex & Building entities');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Complex CRUD Handlers
  // ----------------------------------------------------------------
  const openCreateComplexModal = () => {
    setEditingComplex(null);
    setComplexForm({
      complexName: '',
      address: '',
      changeUserId: currentUser?.email || currentUser?.uid || 'admin_user',
    });
    setIsComplexModalOpen(true);
  };

  const openEditComplexModal = (item: ComplexEntity) => {
    setEditingComplex(item);
    setComplexForm({
      complexName: item.complexName,
      address: item.address,
      changeUserId: currentUser?.email || currentUser?.uid || item.changeUserId || 'admin_user',
    });
    setIsComplexModalOpen(true);
  };

  const handleComplexSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complexForm.complexName.trim() || !complexForm.address.trim()) {
      setError('ComplexName and Address are mandatory');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (editingComplex) {
        // Update
        const updated = await databaseApi.updateComplex(editingComplex.complexId, {
          complexName: complexForm.complexName,
          address: complexForm.address,
          changeUserId: complexForm.changeUserId,
        });
        notifySuccess(`Complex #${updated.complexId} (${updated.complexName}) updated successfully`);
        if (onAuditLog) {
          onAuditLog('UPDATE_COMPLEX', 'complex', String(updated.complexId), `Updated ${updated.complexName}`);
        }
      } else {
        // Create
        const created = await databaseApi.createComplex({
          complexName: complexForm.complexName,
          address: complexForm.address,
          changeUserId: complexForm.changeUserId,
        });
        notifySuccess(`Complex #${created.complexId} (${created.complexName}) created successfully`);
        if (onAuditLog) {
          onAuditLog('CREATE_COMPLEX', 'complex', String(created.complexId), `Created ${created.complexName}`);
        }
      }
      setIsComplexModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      setError(err.message || 'Failed to save complex');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Building CRUD Handlers
  // ----------------------------------------------------------------
  const openCreateBuildingModal = (defaultComplexId?: number) => {
    setEditingBuilding(null);
    const initialComplex = defaultComplexId || (complexes.length > 0 ? complexes[0].complexId : '');
    setBuildingForm({
      complexId: String(initialComplex),
      buildingName: '',
      changeUserId: currentUser?.email || currentUser?.uid || 'admin_user',
    });
    setIsBuildingModalOpen(true);
  };

  const openEditBuildingModal = (item: BuildingEntity) => {
    setEditingBuilding(item);
    setBuildingForm({
      complexId: String(item.complexId),
      buildingName: item.buildingName,
      changeUserId: currentUser?.email || currentUser?.uid || item.changeUserId || 'admin_user',
    });
    setIsBuildingModalOpen(true);
  };

  const handleBuildingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildingForm.complexId || !buildingForm.buildingName.trim()) {
      setError('Complex selection and BuildingName are mandatory');
      return;
    }

    const numericComplexId = parseInt(buildingForm.complexId, 10);
    if (isNaN(numericComplexId)) {
      setError('Invalid Complex ID selected');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (editingBuilding) {
        // Update
        const updated = await databaseApi.updateBuilding(editingBuilding.buildingId, {
          complexId: numericComplexId,
          buildingName: buildingForm.buildingName,
          changeUserId: buildingForm.changeUserId,
        });
        notifySuccess(`Building #${updated.buildingId} (${updated.buildingName}) updated successfully`);
        if (onAuditLog) {
          onAuditLog('UPDATE_BUILDING', 'building', String(updated.buildingId), `Updated ${updated.buildingName}`);
        }
      } else {
        // Create
        const created = await databaseApi.createBuilding({
          complexId: numericComplexId,
          buildingName: buildingForm.buildingName,
          changeUserId: buildingForm.changeUserId,
        });
        notifySuccess(`Building #${created.buildingId} (${created.buildingName}) created successfully`);
        if (onAuditLog) {
          onAuditLog('CREATE_BUILDING', 'building', String(created.buildingId), `Created ${created.buildingName}`);
        }
      }
      setIsBuildingModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      setError(err.message || 'Failed to save building');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Delete Execution
  // ----------------------------------------------------------------
  const executeDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    setError(null);
    try {
      if (deleteTarget.type === 'complex') {
        await databaseApi.deleteComplex(deleteTarget.id);
        notifySuccess(`Complex #${deleteTarget.id} and its associated buildings were deleted`);
        if (onAuditLog) {
          onAuditLog('DELETE_COMPLEX', 'complex', String(deleteTarget.id), `Deleted complex #${deleteTarget.id}`);
        }
      } else {
        await databaseApi.deleteBuilding(deleteTarget.id);
        notifySuccess(`Building #${deleteTarget.id} was deleted`);
        if (onAuditLog) {
          onAuditLog('DELETE_BUILDING', 'building', String(deleteTarget.id), `Deleted building #${deleteTarget.id}`);
        }
      }
      setDeleteTarget(null);
      await fetchAllData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  // Filtered lists
  const filteredComplexes = useMemo(() => {
    return complexes.filter((c) => {
      const matchSearch =
        c.complexName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(c.complexId).includes(searchTerm);
      return matchSearch;
    });
  }, [complexes, searchTerm]);

  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      const matchComplex =
        selectedComplexFilter === 'all' || b.complexId === Number(selectedComplexFilter);
      const matchSearch =
        b.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.complexName && b.complexName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(b.buildingId).includes(searchTerm);
      return matchComplex && matchSearch;
    });
  }, [buildings, searchTerm, selectedComplexFilter]);

  // Selected complex for relation inspector
  const inspectedComplexObj = useMemo(() => {
    return complexes.find((c) => c.complexId === inspectComplexId) || complexes[0] || null;
  }, [complexes, inspectComplexId]);

  const inspectedBuildingsList = useMemo(() => {
    if (!inspectedComplexObj) return [];
    return buildings.filter((b) => b.complexId === inspectedComplexObj.complexId);
  }, [buildings, inspectedComplexObj]);

  // Helper date formatter
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Cloud SQL PostgreSQL Status & Relationship Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 text-white shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Database className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                Cloud SQL • PostgreSQL
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Region: europe-west2 (Live)
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                Complex 1 ──&lt; N Buildings
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Relational Database Entities & CRUD Manager
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Managed live in Google Cloud SQL PostgreSQL. Entities follow the strict schema with automatic foreign key constraint, cascade deletion, and audit tracking (<span className="font-mono text-teal-300">ChangeUserID</span>, <span className="font-mono text-teal-300">ChangeDate</span>).
            </p>
          </div>

          {/* Right Action: Firebase User Badge & Seed Data Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
                <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white uppercase text-[10px]">
                  {currentUser.email ? currentUser.email[0] : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-200 truncate max-w-[140px]">{currentUser.email || 'Authenticated'}</span>
                  <span className="text-[10px] text-teal-400">Firebase User</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-rose-300 text-[11px] font-medium ml-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="inline-flex items-center px-3 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
                {authLoading ? 'Signing in...' : 'Sign In with Google'}
              </button>
            )}

            <button
              onClick={fetchAllData}
              disabled={loading}
              title="Refresh live data from Cloud SQL"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
            </button>

            {complexes.length === 0 && (
              <button
                onClick={handleSeed}
                disabled={loading}
                className="inline-flex items-center px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Populate Demo Entities
              </button>
            )}
          </div>
        </div>

        {/* Database Metric Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800 text-left">
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Total Complexes</span>
            <span className="text-lg font-bold text-teal-300">{complexes.length}</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Total Buildings</span>
            <span className="text-lg font-bold text-teal-300">{buildings.length}</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Foreign Key Relation</span>
            <span className="text-xs font-semibold text-slate-200">CASCADE ON DELETE</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Active Engine</span>
            <span className="text-xs font-semibold text-emerald-400">PostgreSQL + Drizzle</span>
          </div>
        </div>
      </div>

      {/* Action Notification Alerts */}
      {actionSuccess && (
        <div className="flex items-center space-x-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm">
          <div className="flex items-start sm:items-center space-x-2 flex-1">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
            <span className="font-medium">{error}</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
            <button
              onClick={() => setError(null)}
              className="text-rose-700 hover:text-rose-900 text-xs font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            id="subtab-complexes"
            onClick={() => setActiveTab('complexes')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'complexes'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Complexes ({complexes.length})</span>
          </button>

          <button
            id="subtab-buildings"
            onClick={() => setActiveTab('buildings')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'buildings'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Buildings ({buildings.length})</span>
          </button>

          <button
            id="subtab-relations"
            onClick={() => setActiveTab('relations')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'relations'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>1:N Relationship View</span>
          </button>
        </div>

        {/* Global Search & Create Shortcut */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 sm:w-64"
            />
          </div>

          {activeTab === 'complexes' && (
            <button
              id="create-complex-btn"
              onClick={openCreateComplexModal}
              className="inline-flex items-center px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Complex
            </button>
          )}

          {activeTab === 'buildings' && (
            <button
              id="create-building-btn"
              onClick={() => openCreateBuildingModal()}
              disabled={complexes.length === 0}
              className={`inline-flex items-center px-3.5 py-2 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer ${
                complexes.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-500'
              }`}
              title={complexes.length === 0 ? 'Create a Complex first before adding Buildings' : 'Add new Building'}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Building
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMPLEXES CRUD TABLE & CARDS */}
      {/* ========================================================================= */}
      {activeTab === 'complexes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  Complex Entity Table (<span className="font-mono text-teal-700">public.complexes</span>)
                </h3>
                <p className="text-xs text-slate-500">
                  Primary entity: ComplexID (PK), ComplexName, Address, ChangeUserID, ChangeDate
                </p>
              </div>
              <span className="text-xs text-slate-600 font-semibold">
                Showing {filteredComplexes.length} of {complexes.length}
              </span>
            </div>

            {loading && complexes.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                <p className="text-xs font-medium">Fetching complexes from Cloud SQL PostgreSQL...</p>
              </div>
            ) : filteredComplexes.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Complex records found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchTerm ? 'No results matched your search term.' : 'Click "New Complex" or "Populate Demo Entities" to add records.'}
                </p>
                <button
                  onClick={openCreateComplexModal}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold inline-flex items-center shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create First Complex
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4 font-mono">ComplexID</th>
                      <th className="py-3 px-4">ComplexName</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4 text-center">Buildings (1:N)</th>
                      <th className="py-3 px-4">ChangeUserID</th>
                      <th className="py-3 px-4">ChangeDate</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredComplexes.map((item) => (
                      <tr key={item.complexId} className="hover:bg-teal-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-teal-800">
                          #{item.complexId}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center space-x-2">
                            <span>{item.complexName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={item.address}>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedComplexFilter(item.complexId);
                              setActiveTab('buildings');
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors cursor-pointer"
                            title="View all buildings for this complex"
                          >
                            <Layers className="w-3 h-3 mr-1" />
                            {item.buildingCount || 0} Buildings
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          <div className="flex items-center space-x-1.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[120px]">{item.changeUserId || 'system'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formatDate(item.changeDate)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => {
                                setInspectComplexId(item.complexId);
                                setActiveTab('relations');
                              }}
                              title="Inspect 1:N relations"
                              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openCreateBuildingModal(item.complexId)}
                              title="Add Building to this Complex"
                              className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditComplexModal(item)}
                              title="Edit Complex"
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'complex',
                                  id: item.complexId,
                                  name: item.complexName,
                                  childCount: item.buildingCount || 0,
                                })
                              }
                              title="Delete Complex"
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BUILDINGS CRUD TABLE & CARDS */}
      {/* ========================================================================= */}
      {activeTab === 'buildings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-700" />
                  Building Entity Table (<span className="font-mono text-teal-700">public.buildings</span>)
                </h3>
                <p className="text-xs text-slate-500">
                  Child entity: BuildingID (PK), ComplexID (FK to complexes), BuildingName, ChangeUserID, ChangeDate
                </p>
              </div>

              {/* Complex Filter Dropdown */}
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">Filter Complex:</span>
                <select
                  value={selectedComplexFilter}
                  onChange={(e) => setSelectedComplexFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Complexes ({buildings.length})</option>
                  {complexes.map((c) => (
                    <option key={c.complexId} value={c.complexId}>
                      #{c.complexId} - {c.complexName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && buildings.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                <p className="text-xs font-medium">Fetching buildings from Cloud SQL PostgreSQL...</p>
              </div>
            ) : filteredBuildings.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Building records found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {complexes.length === 0
                    ? 'You must create at least one Complex before adding Buildings.'
                    : 'Click "New Building" to add a building to a complex.'}
                </p>
                {complexes.length > 0 && (
                  <button
                    onClick={() => openCreateBuildingModal()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold inline-flex items-center shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create First Building
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4 font-mono">BuildingID</th>
                      <th className="py-3 px-4">BuildingName</th>
                      <th className="py-3 px-4">Parent Complex (FK ComplexID)</th>
                      <th className="py-3 px-4">ChangeUserID</th>
                      <th className="py-3 px-4">ChangeDate</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBuildings.map((item) => (
                      <tr key={item.buildingId} className="hover:bg-teal-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                          #{item.buildingId}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center space-x-2">
                            <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{item.buildingName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                              Complex #{item.complexId}
                            </span>
                            <span className="font-semibold text-slate-800 truncate max-w-xs">
                              {item.complexName || 'Parent Complex'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          <div className="flex items-center space-x-1.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[120px]">{item.changeUserId || 'system'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formatDate(item.changeDate)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => openEditBuildingModal(item)}
                              title="Edit Building"
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'building',
                                  id: item.buildingId,
                                  name: item.buildingName,
                                })
                              }
                              title="Delete Building"
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 1:N RELATIONAL DIAGRAM & DRILL-DOWN INSPECTOR */}
      {/* ========================================================================= */}
      {activeTab === 'relations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of 1 Parent Complexes */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  Parent Entity (1)
                </h3>
                <p className="text-[11px] text-slate-500">Select a Complex to inspect child buildings</p>
              </div>
              <button
                onClick={openCreateComplexModal}
                className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                title="Add new Complex"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {complexes.map((c) => {
                const isSelected = inspectedComplexObj?.complexId === c.complexId;
                return (
                  <div
                    key={c.complexId}
                    onClick={() => setInspectComplexId(c.complexId)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                          #{c.complexId}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{c.complexName}</h4>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-teal-700 translate-x-1' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{c.address}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-200/60">
                      <span>Changed by: <span className="font-mono text-slate-600">{c.changeUserId || 'system'}</span></span>
                      <span className="font-semibold text-teal-700">{c.buildingCount || 0} Child Buildings</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: N Child Buildings belonging to the selected Complex */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            {inspectedComplexObj ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                        Child Buildings (N) for:
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{inspectedComplexObj.complexName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Foreign key: buildings.complex_id = {inspectedComplexObj.complexId}
                    </p>
                  </div>

                  <button
                    onClick={() => openCreateBuildingModal(inspectedComplexObj.complexId)}
                    className="inline-flex items-center px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Building to #{inspectedComplexObj.complexId}
                  </button>
                </div>

                {inspectedBuildingsList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                    <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No child buildings linked to this Complex</p>
                    <button
                      onClick={() => openCreateBuildingModal(inspectedComplexObj.complexId)}
                      className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      + Add the first building to this complex
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {inspectedBuildingsList.map((b) => (
                      <div
                        key={b.buildingId}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                              Building #{b.buildingId}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{b.buildingName}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                            <span>User: <span className="font-mono text-slate-600">{b.changeUserId || 'system'}</span></span>
                            <span>•</span>
                            <span>Updated: {formatDate(b.changeDate)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openEditBuildingModal(b)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Edit building"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                type: 'building',
                                id: b.buildingId,
                                name: b.buildingName,
                              })
                            }
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Delete building"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs">No complex selected</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT COMPLEX */}
      {/* ========================================================================= */}
      {isComplexModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base">
                  {editingComplex ? `Edit Complex #${editingComplex.complexId}` : 'Create New Complex'}
                </h3>
              </div>
              <button
                onClick={() => setIsComplexModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleComplexSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Complex Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akdeniz Royal Residence"
                  value={complexForm.complexName}
                  onChange={(e) => setComplexForm({ ...complexForm, complexName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Mahmutlar Mah. Barbaros Cad. No: 142, Alanya / Antalya"
                  value={complexForm.address}
                  onChange={(e) => setComplexForm({ ...complexForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Change User ID (<span className="font-mono text-slate-500">ChangeUserID</span>)
                </label>
                <input
                  type="text"
                  placeholder="e.g. user email or admin_user"
                  value={complexForm.changeUserId}
                  onChange={(e) => setComplexForm({ ...complexForm, changeUserId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  <span className="font-mono">ChangeDate</span> is automatically stamped to current PostgreSQL timestamp upon saving.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsComplexModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : editingComplex ? 'Update Complex' : 'Create Complex'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT BUILDING */}
      {/* ========================================================================= */}
      {isBuildingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base">
                  {editingBuilding ? `Edit Building #${editingBuilding.buildingId}` : 'Create New Building'}
                </h3>
              </div>
              <button
                onClick={() => setIsBuildingModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBuildingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Parent Complex (<span className="font-mono text-teal-700">ComplexID</span>) <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={buildingForm.complexId}
                  onChange={(e) => setBuildingForm({ ...buildingForm, complexId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>Select parent complex...</option>
                  {complexes.map((c) => (
                    <option key={c.complexId} value={c.complexId}>
                      #{c.complexId} - {c.complexName} ({c.address})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Establishes the foreign key reference from Building to Complex.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Building Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A Blok (West Tower)"
                  value={buildingForm.buildingName}
                  onChange={(e) => setBuildingForm({ ...buildingForm, buildingName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Change User ID (<span className="font-mono text-slate-500">ChangeUserID</span>)
                </label>
                <input
                  type="text"
                  placeholder="e.g. user email or admin_user"
                  value={buildingForm.changeUserId}
                  onChange={(e) => setBuildingForm({ ...buildingForm, changeUserId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsBuildingModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : editingBuilding ? 'Update Building' : 'Create Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200 shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Delete {deleteTarget.type === 'complex' ? 'Complex' : 'Building'} #{deleteTarget.id}
                </h3>
                <p className="text-xs text-slate-500">This action will immediately execute in PostgreSQL.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>
                Are you sure you want to permanently delete <strong className="text-slate-900">"{deleteTarget.name}"</strong>?
              </p>
              {deleteTarget.type === 'complex' && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] font-semibold">
                  ⚠️ Cascade Warning: Deleting this Complex will automatically delete all its associated child Buildings ({deleteTarget.childCount || 0} buildings) due to the database foreign key constraint.
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={loading}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
