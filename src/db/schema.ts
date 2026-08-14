import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table for Firebase Auth synchronization
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email'),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Complex entity - Exact casing requested:
// ComplexID, ComplexName, Address, ChangeUserID, ChangeDate
export const Complex = pgTable('Complex', {
  ComplexID: serial('ComplexID').primaryKey(),
  ComplexName: text('ComplexName').notNull(),
  Address: text('Address').notNull(),
  ChangeUserID: text('ChangeUserID'),
  ChangeDate: timestamp('ChangeDate').defaultNow().notNull(),
});

// Building entity - Exact casing requested:
// BuildingID, ComplexID, BuildingName, ChangeUserID, ChangeDate
export const Building = pgTable('Building', {
  BuildingID: serial('BuildingID').primaryKey(),
  ComplexID: integer('ComplexID')
    .references(() => Complex.ComplexID, { onDelete: 'cascade' })
    .notNull(),
  BuildingName: text('BuildingName').notNull(),
  ChangeUserID: text('ChangeUserID'),
  ChangeDate: timestamp('ChangeDate').defaultNow().notNull(),
});

// Relations
export const complexRelations = relations(Complex, ({ many }) => ({
  buildings: many(Building),
}));

export const buildingRelations = relations(Building, ({ one }) => ({
  complex: one(Complex, {
    fields: [Building.ComplexID],
    references: [Complex.ComplexID],
  }),
}));

export type ComplexEntity = typeof Complex.$inferSelect;
export type NewComplexEntity = typeof Complex.$inferInsert;
export type BuildingEntity = typeof Building.$inferSelect;
export type NewBuildingEntity = typeof Building.$inferInsert;
