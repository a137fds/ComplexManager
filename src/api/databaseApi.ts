import { auth } from '../lib/firebase.ts';

export interface ComplexEntity {
  ComplexID: number;
  ComplexName: string;
  Address: string;
  ChangeUserID: string | null;
  ChangeDate: string;
  buildingCount?: number;
  buildings?: BuildingEntity[];

  // Normalized helper aliases for UI bindings
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

  // Normalized helper aliases for UI bindings
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

// Get authorization headers if Firebase user is logged in
async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Could not acquire Firebase token:', err);
  }

  return headers;
}

function normalizeComplex(item: any): ComplexEntity {
  const ComplexID = item.ComplexID ?? item.complexId ?? 0;
  const ComplexName = item.ComplexName ?? item.complexName ?? '';
  const Address = item.Address ?? item.address ?? '';
  const ChangeUserID = item.ChangeUserID ?? item.changeUserId ?? null;
  const ChangeDate = item.ChangeDate ?? item.changeDate ?? new Date().toISOString();

  return {
    ...item,
    ComplexID,
    ComplexName,
    Address,
    ChangeUserID,
    ChangeDate,
    complexId: ComplexID,
    complexName: ComplexName,
    address: Address,
    changeUserId: ChangeUserID,
    changeDate: String(ChangeDate),
    buildingCount: item.buildingCount !== undefined ? Number(item.buildingCount) : undefined,
    buildings: Array.isArray(item.buildings) ? item.buildings.map(normalizeBuilding) : undefined,
  };
}

function normalizeBuilding(item: any): BuildingEntity {
  const BuildingID = item.BuildingID ?? item.buildingId ?? 0;
  const ComplexID = item.ComplexID ?? item.complexId ?? 0;
  const BuildingName = item.BuildingName ?? item.buildingName ?? '';
  const ChangeUserID = item.ChangeUserID ?? item.changeUserId ?? null;
  const ChangeDate = item.ChangeDate ?? item.changeDate ?? new Date().toISOString();
  const ComplexName = item.ComplexName ?? item.complexName ?? undefined;
  const Address = item.Address ?? item.complexAddress ?? item.address ?? undefined;

  return {
    ...item,
    BuildingID,
    ComplexID,
    BuildingName,
    ChangeUserID,
    ChangeDate,
    ComplexName,
    Address,
    buildingId: BuildingID,
    complexId: ComplexID,
    buildingName: BuildingName,
    changeUserId: ChangeUserID,
    changeDate: String(ChangeDate),
    complexName: ComplexName,
    complexAddress: Address,
  };
}

export const databaseApi = {
  // Check backend & database health
  async checkHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Seed initial demo data
  async seedDemo() {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers,
    });
    return res.json() as Promise<ApiResponse<any>>;
  },

  // --------------------------------------------------
  // Complex CRUD API
  // --------------------------------------------------
  async getComplexes(): Promise<ComplexEntity[]> {
    const res = await fetch('/api/complexes');
    const json: ApiResponse<any[]> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to fetch complexes');
    }
    return json.data.map(normalizeComplex);
  },

  async getComplexById(id: number): Promise<ComplexEntity> {
    const res = await fetch(`/api/complexes/${id}`);
    const json: ApiResponse<any> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to fetch complex');
    }
    return normalizeComplex(json.data);
  },

  async createComplex(data: {
    ComplexName?: string;
    complexName?: string;
    Address?: string;
    address?: string;
    ChangeUserID?: string;
    changeUserId?: string;
  }): Promise<ComplexEntity> {
    const payload = {
      ComplexName: data.ComplexName || data.complexName || '',
      Address: data.Address || data.address || '',
      ChangeUserID: data.ChangeUserID || data.changeUserId,
    };
    const headers = await getAuthHeaders();
    const res = await fetch('/api/complexes', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const json: ApiResponse<any> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to create complex');
    }
    return normalizeComplex(json.data);
  },

  async updateComplex(
    id: number,
    data: {
      ComplexName?: string;
      complexName?: string;
      Address?: string;
      address?: string;
      ChangeUserID?: string;
      changeUserId?: string;
    }
  ): Promise<ComplexEntity> {
    const payload = {
      ComplexName: data.ComplexName ?? data.complexName,
      Address: data.Address ?? data.address,
      ChangeUserID: data.ChangeUserID ?? data.changeUserId,
    };
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/complexes/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    const json: ApiResponse<any> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to update complex');
    }
    return normalizeComplex(json.data);
  },

  async deleteComplex(id: number): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/complexes/${id}`, {
      method: 'DELETE',
      headers,
    });
    const json: ApiResponse<any> = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Failed to delete complex');
    }
  },

  // --------------------------------------------------
  // Building CRUD API
  // --------------------------------------------------
  async getBuildings(complexId?: number): Promise<BuildingEntity[]> {
    const url = complexId ? `/api/buildings?ComplexID=${complexId}` : '/api/buildings';
    const res = await fetch(url);
    const json: ApiResponse<any[]> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to fetch buildings');
    }
    return json.data.map(normalizeBuilding);
  },

  async getBuildingById(id: number): Promise<BuildingEntity> {
    const res = await fetch(`/api/buildings/${id}`);
    const json: ApiResponse<any> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to fetch building');
    }
    return normalizeBuilding(json.data);
  },

  async createBuilding(data: {
    ComplexID?: number;
    complexId?: number;
    BuildingName?: string;
    buildingName?: string;
    ChangeUserID?: string;
    changeUserId?: string;
  }): Promise<BuildingEntity> {
    const payload = {
      ComplexID: data.ComplexID ?? data.complexId,
      BuildingName: data.BuildingName || data.buildingName || '',
      ChangeUserID: data.ChangeUserID || data.changeUserId,
    };
    const headers = await getAuthHeaders();
    const res = await fetch('/api/buildings', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const json: ApiResponse<any> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to create building');
    }
    return normalizeBuilding(json.data);
  },

  async updateBuilding(
    id: number,
    data: {
      ComplexID?: number;
      complexId?: number;
      BuildingName?: string;
      buildingName?: string;
      ChangeUserID?: string;
      changeUserId?: string;
    }
  ): Promise<BuildingEntity> {
    const payload = {
      ComplexID: data.ComplexID ?? data.complexId,
      BuildingName: data.BuildingName ?? data.buildingName,
      ChangeUserID: data.ChangeUserID ?? data.changeUserId,
    };
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/buildings/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    const json: ApiResponse<any> = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Failed to update building');
    }
    return normalizeBuilding(json.data);
  },

  async deleteBuilding(id: number): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/buildings/${id}`, {
      method: 'DELETE',
      headers,
    });
    const json: ApiResponse<any> = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Failed to delete building');
    }
  },
};
