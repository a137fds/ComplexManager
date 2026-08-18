import { supabase } from '../lib/supabase';

export interface ComplexEntity {
  ComplexID: number;
  ComplexName: string;
  Address: string;
  ChangeUserID: string | null;
  ChangeDate: string;
  buildingCount?: number;
  buildings?: BuildingEntity[];
  complexId: number;
  complexName: string;
  address: string;
  changeUserId: string | null;
  changeDate: string;
}

export interface BuildingEntity {
  BuildingID: number;
  ComplexID: number;
  BuildingName: string;
  ChangeUserID: string | null;
  ChangeDate: string;
  ComplexName?: string;
  Address?: string;
  buildingId: number;
  complexId: number;
  buildingName: string;
  changeUserId: string | null;
  changeDate: string;
  complexName?: string;
  complexAddress?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://tntoxgpemvitpqkjxdki.supabase.co/functions/v1/api'
).replace(/\/$/, '');

function requiredPermission(path: string, method: string): string | null {
  const normalized = path.split('?')[0];
  const isComplex = normalized === '/complexes' || normalized.startsWith('/complexes/');
  const isBuilding = normalized === '/buildings' || normalized.startsWith('/buildings/');
  if (isComplex) {
    if (method === 'GET') return 'complex.view';
    if (method === 'POST') return 'complex.create';
    if (method === 'PUT' || method === 'PATCH') return 'complex.edit';
    if (method === 'DELETE') return 'complex.delete';
  }
  if (isBuilding) {
    if (method === 'GET') return 'buildings.view';
    if (method === 'POST') return 'buildings.create';
    if (method === 'PUT' || method === 'PATCH') return 'buildings.edit';
    if (method === 'DELETE') return 'buildings.delete';
  }
  return null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Authentication required');

  const method = (options?.method || 'GET').toUpperCase();
  const permission = requiredPermission(path, method);
  if (permission) {
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (profileError) throw new Error('Unable to verify permissions');

    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('code', profile.role)
      .single();
    if (roleError) throw new Error('Unable to verify role permissions');

    const { data: permissionRow, error: permissionError } = await supabase
      .from('permissions')
      .select('id')
      .eq('code', permission)
      .single();
    if (permissionError) throw new Error('Unable to verify requested permission');

    const { data: assignment, error: assignmentError } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', role.id)
      .eq('permission_id', permissionRow.id)
      .maybeSingle();
    if (assignmentError || !assignment) throw new Error('Permission denied');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...(options?.headers || {}),
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json?.error || `API request failed (${response.status})`);
  return json as T;
}

function normalizeComplex(item: any): ComplexEntity {
  const ComplexID = item.ComplexID ?? item.complexId ?? 0;
  const ComplexName = item.ComplexName ?? item.complexName ?? '';
  const Address = item.Address ?? item.address ?? '';
  const ChangeUserID = item.ChangeUserID ?? item.changeUserId ?? null;
  const ChangeDate = item.ChangeDate ?? item.changeDate ?? new Date().toISOString();
  return { ...item, ComplexID, ComplexName, Address, ChangeUserID, ChangeDate, complexId: ComplexID, complexName: ComplexName, address: Address, changeUserId: ChangeUserID, changeDate: String(ChangeDate), buildingCount: item.buildingCount !== undefined ? Number(item.buildingCount) : undefined, buildings: Array.isArray(item.buildings) ? item.buildings.map(normalizeBuilding) : undefined };
}

function normalizeBuilding(item: any): BuildingEntity {
  const BuildingID = item.BuildingID ?? item.buildingId ?? 0;
  const ComplexID = item.ComplexID ?? item.complexId ?? 0;
  const BuildingName = item.BuildingName ?? item.buildingName ?? '';
  const ChangeUserID = item.ChangeUserID ?? item.changeUserId ?? null;
  const ChangeDate = item.ChangeDate ?? item.changeDate ?? new Date().toISOString();
  const ComplexName = item.ComplexName ?? item.complexName ?? undefined;
  const Address = item.Address ?? item.complexAddress ?? item.address ?? undefined;
  return { ...item, BuildingID, ComplexID, BuildingName, ChangeUserID, ChangeDate, ComplexName, Address, buildingId: BuildingID, complexId: ComplexID, buildingName: BuildingName, changeUserId: ChangeUserID, changeDate: String(ChangeDate), complexName: ComplexName, complexAddress: Address };
}

export const databaseApi = {
  async checkHealth() { return request<ApiResponse<{ status: string }>>('/health'); },
  async seedDemo() { return request<ApiResponse<any>>('/seed', { method: 'POST' }); },
  async getComplexes(): Promise<ComplexEntity[]> { const json = await request<ApiResponse<any[]>>('/complexes'); if (!json.success || !json.data) throw new Error(json.error || 'Failed to fetch complexes'); return json.data.map(normalizeComplex); },
  async getComplexById(id: number): Promise<ComplexEntity> { const json = await request<ApiResponse<any>>(`/complexes/${id}`); if (!json.success || !json.data) throw new Error(json.error || 'Failed to fetch complex'); return normalizeComplex(json.data); },
  async createComplex(data: { ComplexName?: string; complexName?: string; Address?: string; address?: string }): Promise<ComplexEntity> { const json = await request<ApiResponse<any>>('/complexes', { method: 'POST', body: JSON.stringify({ ComplexName: data.ComplexName || data.complexName || '', Address: data.Address || data.address || '' }) }); if (!json.success || !json.data) throw new Error(json.error || 'Failed to create complex'); return normalizeComplex(json.data); },
  async updateComplex(id: number, data: { ComplexName?: string; complexName?: string; Address?: string; address?: string }): Promise<ComplexEntity> { const json = await request<ApiResponse<any>>(`/complexes/${id}`, { method: 'PUT', body: JSON.stringify({ ComplexName: data.ComplexName ?? data.complexName, Address: data.Address ?? data.address }) }); if (!json.success || !json.data) throw new Error(json.error || 'Failed to update complex'); return normalizeComplex(json.data); },
  async deleteComplex(id: number): Promise<void> { const json = await request<ApiResponse<any>>(`/complexes/${id}`, { method: 'DELETE' }); if (!json.success) throw new Error(json.error || 'Failed to delete complex'); },
  async getBuildings(complexId?: number): Promise<BuildingEntity[]> { const query = complexId ? `?ComplexID=${encodeURIComponent(complexId)}` : ''; const json = await request<ApiResponse<any[]>>(`/buildings${query}`); if (!json.success || !json.data) throw new Error(json.error || 'Failed to fetch buildings'); return json.data.map(normalizeBuilding); },
  async getBuildingById(id: number): Promise<BuildingEntity> { const json = await request<ApiResponse<any>>(`/buildings/${id}`); if (!json.success || !json.data) throw new Error(json.error || 'Failed to fetch building'); return normalizeBuilding(json.data); },
  async createBuilding(data: { ComplexID?: number; complexId?: number; BuildingName?: string; buildingName?: string }): Promise<BuildingEntity> { const json = await request<ApiResponse<any>>('/buildings', { method: 'POST', body: JSON.stringify({ ComplexID: data.ComplexID ?? data.complexId, BuildingName: data.BuildingName || data.buildingName || '' }) }); if (!json.success || !json.data) throw new Error(json.error || 'Failed to create building'); return normalizeBuilding(json.data); },
  async updateBuilding(id: number, data: { ComplexID?: number; complexId?: number; BuildingName?: string; buildingName?: string }): Promise<BuildingEntity> { const json = await request<ApiResponse<any>>(`/buildings/${id}`, { method: 'PUT', body: JSON.stringify({ ComplexID: data.ComplexID ?? data.complexId, BuildingName: data.BuildingName ?? data.buildingName }) }); if (!json.success || !json.data) throw new Error(json.error || 'Failed to update building'); return normalizeBuilding(json.data); },
  async deleteBuilding(id: number): Promise<void> { const json = await request<ApiResponse<any>>(`/buildings/${id}`, { method: 'DELETE' }); if (!json.success) throw new Error(json.error || 'Failed to delete building'); },
};
