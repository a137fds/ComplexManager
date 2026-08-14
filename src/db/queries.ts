import { eq, desc, sql } from 'drizzle-orm';
import { db } from './index.ts';
import { Complex, Building, users } from './schema.ts';

// ----------------------------------------------------
// Users synchronization
// ----------------------------------------------------
export async function getOrCreateUser(uid: string, email?: string | null, displayName?: string | null) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email: email || null,
        displayName: displayName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: email || null,
          displayName: displayName || null,
        },
      })
      .returning();
    return result[0];
  } catch (error: any) {
    console.error("Database user sync failed:", error);
    throw new Error(`Failed to synchronize user: ${error?.message || error}`);
  }
}

// ----------------------------------------------------
// Complex CRUD Operations
// ----------------------------------------------------
export async function getComplexes() {
  try {
    const complexes = await db
      .select()
      .from(Complex)
      .orderBy(desc(Complex.ChangeDate));

    // Retrieve building counts
    const buildingCounts = await db
      .select({
        ComplexID: Building.ComplexID,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(Building)
      .groupBy(Building.ComplexID);

    const countsMap = new Map<number, number>();
    for (const b of buildingCounts) {
      countsMap.set(b.ComplexID, Number(b.count));
    }

    return complexes.map((c) => ({
      ...c,
      buildingCount: countsMap.get(c.ComplexID) || 0,
    }));
  } catch (error: any) {
    console.error("Database query failed (getComplexes):", error);
    throw new Error(`Failed to retrieve complexes: ${error?.message || error}`);
  }
}

export async function getComplexById(id: number) {
  try {
    const complexData = await db
      .select()
      .from(Complex)
      .where(eq(Complex.ComplexID, id));

    if (!complexData.length) return null;

    const buildingList = await db
      .select()
      .from(Building)
      .where(eq(Building.ComplexID, id))
      .orderBy(desc(Building.ChangeDate));

    return {
      ...complexData[0],
      buildings: buildingList,
    };
  } catch (error: any) {
    console.error(`Database query failed (getComplexById ${id}):`, error);
    throw new Error(`Failed to retrieve complex details: ${error?.message || error}`);
  }
}

export async function createComplex(data: {
  ComplexName: string;
  Address: string;
  ChangeUserID?: string | null;
}) {
  try {
    const result = await db
      .insert(Complex)
      .values({
        ComplexName: data.ComplexName.trim(),
        Address: data.Address.trim(),
        ChangeUserID: data.ChangeUserID || 'anonymous',
        ChangeDate: new Date(),
      })
      .returning();
    return result[0];
  } catch (error: any) {
    console.error("Database query failed (createComplex):", error);
    throw new Error(`Failed to create complex: ${error?.message || error}`);
  }
}

export async function updateComplex(
  id: number,
  data: {
    ComplexName?: string;
    Address?: string;
    ChangeUserID?: string | null;
  }
) {
  try {
    const updatePayload: Record<string, any> = {
      ChangeDate: new Date(),
    };
    if (data.ComplexName !== undefined) updatePayload.ComplexName = data.ComplexName.trim();
    if (data.Address !== undefined) updatePayload.Address = data.Address.trim();
    if (data.ChangeUserID !== undefined) updatePayload.ChangeUserID = data.ChangeUserID || 'anonymous';

    const result = await db
      .update(Complex)
      .set(updatePayload)
      .where(eq(Complex.ComplexID, id))
      .returning();
    return result[0] || null;
  } catch (error: any) {
    console.error(`Database query failed (updateComplex ${id}):`, error);
    throw new Error(`Failed to update complex: ${error?.message || error}`);
  }
}

export async function deleteComplex(id: number) {
  try {
    const result = await db
      .delete(Complex)
      .where(eq(Complex.ComplexID, id))
      .returning();
    return result[0] || null;
  } catch (error: any) {
    console.error(`Database query failed (deleteComplex ${id}):`, error);
    throw new Error(`Failed to delete complex: ${error?.message || error}`);
  }
}

// ----------------------------------------------------
// Building CRUD Operations
// ----------------------------------------------------
export async function getBuildings(complexIdFilter?: number) {
  try {
    if (complexIdFilter) {
      const buildings = await db
        .select()
        .from(Building)
        .where(eq(Building.ComplexID, complexIdFilter))
        .orderBy(desc(Building.ChangeDate));

      const complexes = await db
        .select()
        .from(Complex)
        .where(eq(Complex.ComplexID, complexIdFilter));

      const complex = complexes[0];
      return buildings.map((b) => ({
        ...b,
        ComplexName: complex?.ComplexName,
        Address: complex?.Address,
      }));
    }

    const [buildings, complexes] = await Promise.all([
      db.select().from(Building).orderBy(desc(Building.ChangeDate)),
      db.select().from(Complex),
    ]);

    const complexMap = new Map<number, typeof complexes[0]>();
    for (const c of complexes) {
      complexMap.set(c.ComplexID, c);
    }

    return buildings.map((b) => {
      const c = complexMap.get(b.ComplexID);
      return {
        ...b,
        ComplexName: c?.ComplexName,
        Address: c?.Address,
      };
    });
  } catch (error: any) {
    console.error("Database query failed (getBuildings):", error);
    throw new Error(`Failed to retrieve buildings: ${error?.message || error}`);
  }
}

export async function getBuildingById(id: number) {
  try {
    const buildings = await db
      .select()
      .from(Building)
      .where(eq(Building.BuildingID, id));

    if (!buildings.length) return null;

    const building = buildings[0];
    const complexes = await db
      .select()
      .from(Complex)
      .where(eq(Complex.ComplexID, building.ComplexID));

    const complex = complexes[0];
    return {
      ...building,
      ComplexName: complex?.ComplexName,
      Address: complex?.Address,
    };
  } catch (error: any) {
    console.error(`Database query failed (getBuildingById ${id}):`, error);
    throw new Error(`Failed to retrieve building details: ${error?.message || error}`);
  }
}

export async function createBuilding(data: {
  ComplexID: number;
  BuildingName: string;
  ChangeUserID?: string | null;
}) {
  try {
    // Verify complex exists first
    const complexExists = await db
      .select({ ComplexID: Complex.ComplexID })
      .from(Complex)
      .where(eq(Complex.ComplexID, data.ComplexID));

    if (!complexExists.length) {
      throw new Error(`Complex with ID ${data.ComplexID} does not exist.`);
    }

    const result = await db
      .insert(Building)
      .values({
        ComplexID: data.ComplexID,
        BuildingName: data.BuildingName.trim(),
        ChangeUserID: data.ChangeUserID || 'anonymous',
        ChangeDate: new Date(),
      })
      .returning();

    return result[0];
  } catch (error: any) {
    console.error("Database query failed (createBuilding):", error);
    throw new Error(`Failed to create building: ${error?.message || error}`);
  }
}

export async function updateBuilding(
  id: number,
  data: {
    ComplexID?: number;
    BuildingName?: string;
    ChangeUserID?: string | null;
  }
) {
  try {
    const updatePayload: Record<string, any> = {
      ChangeDate: new Date(),
    };
    if (data.ComplexID !== undefined) {
      const complexExists = await db
        .select({ ComplexID: Complex.ComplexID })
        .from(Complex)
        .where(eq(Complex.ComplexID, data.ComplexID));
      if (!complexExists.length) {
        throw new Error(`Complex with ID ${data.ComplexID} does not exist.`);
      }
      updatePayload.ComplexID = data.ComplexID;
    }
    if (data.BuildingName !== undefined) updatePayload.BuildingName = data.BuildingName.trim();
    if (data.ChangeUserID !== undefined) updatePayload.ChangeUserID = data.ChangeUserID || 'anonymous';

    const result = await db
      .update(Building)
      .set(updatePayload)
      .where(eq(Building.BuildingID, id))
      .returning();

    return result[0] || null;
  } catch (error: any) {
    console.error(`Database query failed (updateBuilding ${id}):`, error);
    throw new Error(`Failed to update building: ${error?.message || error}`);
  }
}

export async function deleteBuilding(id: number) {
  try {
    const result = await db
      .delete(Building)
      .where(eq(Building.BuildingID, id))
      .returning();
    return result[0] || null;
  } catch (error: any) {
    console.error(`Database query failed (deleteBuilding ${id}):`, error);
    throw new Error(`Failed to delete building: ${error?.message || error}`);
  }
}

// ----------------------------------------------------
// Initial Seed Helper
// ----------------------------------------------------
export async function seedDemoEntities(userId: string = 'system') {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(Complex);
    if (Number(existing[0]?.count) > 0) {
      return { message: "Database already contains records." };
    }

    // Seed initial demo complex and buildings
    const [complexA] = await db.insert(Complex).values({
      ComplexName: 'Akdeniz Royal Residence',
      Address: 'Mahmutlar Mah. Barbaros Cad. No: 142, Alanya / Antalya',
      ChangeUserID: userId,
      ChangeDate: new Date(),
    }).returning();

    const [complexB] = await db.insert(Complex).values({
      ComplexName: 'Toros Panorama Sitesi',
      Address: 'Kargıcak Mah. Gazipaşa Yolu Üzeri No: 58, Alanya / Antalya',
      ChangeUserID: userId,
      ChangeDate: new Date(),
    }).returning();

    await db.insert(Building).values([
      {
        ComplexID: complexA.ComplexID,
        BuildingName: 'A Blok (West Tower)',
        ChangeUserID: userId,
        ChangeDate: new Date(),
      },
      {
        ComplexID: complexA.ComplexID,
        BuildingName: 'B Blok (East Tower)',
        ChangeUserID: userId,
        ChangeDate: new Date(),
      },
      {
        ComplexID: complexA.ComplexID,
        BuildingName: 'C Blok (Garden Suites)',
        ChangeUserID: userId,
        ChangeDate: new Date(),
      },
      {
        ComplexID: complexB.ComplexID,
        BuildingName: 'Ana Blok (Main Wing)',
        ChangeUserID: userId,
        ChangeDate: new Date(),
      },
      {
        ComplexID: complexB.ComplexID,
        BuildingName: 'Villa Bölümü (Villas 1-8)',
        ChangeUserID: userId,
        ChangeDate: new Date(),
      },
    ]);

    return { message: "Seed data successfully populated." };
  } catch (error: any) {
    console.error("Database seed failed:", error);
    throw new Error(`Failed to seed demo entities: ${error?.message || error}`);
  }
}
