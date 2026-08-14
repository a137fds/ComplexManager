import { desc, eq, sql } from 'drizzle-orm';
import { db } from './index.ts';
import { Building, Complex, users } from './schema.ts';

export async function getOrCreateUser(uid: string, email?: string | null, displayName?: string | null) {
  const result = await db.insert(users).values({
    uid,
    email: email || null,
    displayName: displayName || null,
  }).onConflictDoUpdate({
    target: users.uid,
    set: { email: email || null, displayName: displayName || null },
  }).returning();
  return result[0];
}

export async function getComplexes() {
  const complexes = await db.select().from(Complex).orderBy(desc(Complex.ChangeDate));
  const counts = await db.select({
    ComplexID: Building.ComplexID,
    count: sql<number>`count(*)`,
  }).from(Building).groupBy(Building.ComplexID);
  const countMap = new Map<number, number>();
  for (const row of counts) countMap.set(row.ComplexID, Number(row.count));
  return complexes.map((complex) => ({
    ...complex,
    buildingCount: countMap.get(complex.ComplexID) ?? 0,
  }));
}

export async function getComplexById(id: number) {
  const complexes = await db.select().from(Complex).where(eq(Complex.ComplexID, id));
  if (!complexes.length) return null;
  const buildings = await db.select().from(Building)
    .where(eq(Building.ComplexID, id))
    .orderBy(desc(Building.ChangeDate));
  return { ...complexes[0], buildings };
}

export async function createComplex(data: { ComplexName: string; Address: string; ChangeUserID?: string | null }) {
  const result = await db.insert(Complex).values({
    ComplexName: data.ComplexName.trim(),
    Address: data.Address.trim(),
    ChangeUserID: data.ChangeUserID || 'anonymous',
    ChangeDate: new Date(),
  }).returning();
  return result[0];
}

export async function updateComplex(id: number, data: { ComplexName?: string; Address?: string; ChangeUserID?: string | null }) {
  const result = await db.update(Complex).set({
    ...(data.ComplexName !== undefined ? { ComplexName: data.ComplexName.trim() } : {}),
    ...(data.Address !== undefined ? { Address: data.Address.trim() } : {}),
    ...(data.ChangeUserID !== undefined ? { ChangeUserID: data.ChangeUserID || 'anonymous' } : {}),
    ChangeDate: new Date(),
  }).where(eq(Complex.ComplexID, id)).returning();
  return result[0] || null;
}

export async function deleteComplex(id: number) {
  const result = await db.delete(Complex).where(eq(Complex.ComplexID, id)).returning();
  return result[0] || null;
}

export async function getBuildings(complexId?: number) {
  const buildings = complexId
    ? await db.select().from(Building).where(eq(Building.ComplexID, complexId)).orderBy(desc(Building.ChangeDate))
    : await db.select().from(Building).orderBy(desc(Building.ChangeDate));
  const complexes = await db.select().from(Complex);
  const complexMap = new Map(complexes.map((c) => [c.ComplexID, c]));
  return buildings.map((building) => {
    const complex = complexMap.get(building.ComplexID);
    return { ...building, ComplexName: complex?.ComplexName, Address: complex?.Address };
  });
}

export async function getBuildingById(id: number) {
  const buildings = await db.select().from(Building).where(eq(Building.BuildingID, id));
  if (!buildings.length) return null;
  const complex = (await db.select().from(Complex).where(eq(Complex.ComplexID, buildings[0].ComplexID)))[0];
  return { ...buildings[0], ComplexName: complex?.ComplexName, Address: complex?.Address };
}

export async function createBuilding(data: { ComplexID: number; BuildingName: string; ChangeUserID?: string | null }) {
  const complex = await db.select({ ComplexID: Complex.ComplexID }).from(Complex).where(eq(Complex.ComplexID, data.ComplexID));
  if (!complex.length) throw new Error(`Complex with ID ${data.ComplexID} does not exist.`);
  const result = await db.insert(Building).values({
    ComplexID: data.ComplexID,
    BuildingName: data.BuildingName.trim(),
    ChangeUserID: data.ChangeUserID || 'anonymous',
    ChangeDate: new Date(),
  }).returning();
  return result[0];
}

export async function updateBuilding(id: number, data: { ComplexID?: number; BuildingName?: string; ChangeUserID?: string | null }) {
  if (data.ComplexID !== undefined) {
    const complex = await db.select({ ComplexID: Complex.ComplexID }).from(Complex).where(eq(Complex.ComplexID, data.ComplexID));
    if (!complex.length) throw new Error(`Complex with ID ${data.ComplexID} does not exist.`);
  }
  const result = await db.update(Building).set({
    ...(data.ComplexID !== undefined ? { ComplexID: data.ComplexID } : {}),
    ...(data.BuildingName !== undefined ? { BuildingName: data.BuildingName.trim() } : {}),
    ...(data.ChangeUserID !== undefined ? { ChangeUserID: data.ChangeUserID || 'anonymous' } : {}),
    ChangeDate: new Date(),
  }).where(eq(Building.BuildingID, id)).returning();
  return result[0] || null;
}

export async function deleteBuilding(id: number) {
  const result = await db.delete(Building).where(eq(Building.BuildingID, id)).returning();
  return result[0] || null;
}

export async function seedDemoEntities(userId = 'system') {
  const existing = await db.select({ count: sql<number>`count(*)` }).from(Complex);
  if (Number(existing[0]?.count) > 0) return { message: 'Database already contains records.' };

  const [complexA] = await db.insert(Complex).values({
    ComplexName: 'Akdeniz Royal Residence',
    Address: 'Mahmutlar Mah. Barbaros Cad. No: 142, Alanya / Antalya',
    ChangeUserID: userId,
  }).returning();

  const [complexB] = await db.insert(Complex).values({
    ComplexName: 'Toros Panorama Sitesi',
    Address: 'Kargıcak Mah. Gazipaşa Yolu Üzeri No: 58, Alanya / Antalya',
    ChangeUserID: userId,
  }).returning();

  await db.insert(Building).values([
    { ComplexID: complexA.ComplexID, BuildingName: 'A Blok', ChangeUserID: userId },
    { ComplexID: complexA.ComplexID, BuildingName: 'B Blok', ChangeUserID: userId },
    { ComplexID: complexA.ComplexID, BuildingName: 'C Blok', ChangeUserID: userId },
    { ComplexID: complexB.ComplexID, BuildingName: 'Ana Blok', ChangeUserID: userId },
  ]);
  return { message: 'Seed data successfully populated.' };
}
