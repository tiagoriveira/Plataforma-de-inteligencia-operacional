import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Assets table - Ativos industriais rastreados
 */
export const assets = mysqlTable("assets", {
  id: varchar("id", { length: 32 }).primaryKey(), // TOR-001, PRE-020, etc
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["MÁQUINA", "VEÍCULO", "FERRAMENTA", "OUTRO"]).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["OPERACIONAL", "MANUTENÇÃO", "CRÍTICO", "INATIVO"]).default("OPERACIONAL").notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  model: varchar("model", { length: 255 }),
  serialNumber: varchar("serialNumber", { length: 255 }),
  year: int("year"),
  warranty: varchar("warranty", { length: 255 }),
  imageUrl: text("imageUrl"),
  instructions: text("instructions"), // V1.1: Instruções para operador (max 500 chars)
  maintenanceIntervalDays: int("maintenanceIntervalDays"), // V1.1: Intervalo de manutenção em dias
  lastMaintenanceDate: timestamp("lastMaintenanceDate"), // V1.1: Última data de manutenção
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").references(() => users.id),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

/**
 * Events table - Histórico imutável de eventos (check-in, check-out, manutenção, problemas, melhorias)
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  assetId: varchar("assetId", { length: 32 }).notNull().references(() => assets.id),
  type: mysqlEnum("type", ["CHECKIN", "CHECKOUT", "INSPECTION", "ISSUE", "IMPROVEMENT", "MAINTENANCE", "NONCONFORMITY"]).notNull(),
  operator: varchar("operator", { length: 255 }).notNull(), // Nome do operador
  observation: text("observation"),
  photoUrl: text("photoUrl"), // URL da foto no S3
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: int("userId").references(() => users.id), // Usuário que registrou (se autenticado)
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;