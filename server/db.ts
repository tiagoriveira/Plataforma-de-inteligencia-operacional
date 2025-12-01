import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, assets, events, Asset, InsertAsset, Event, InsertEvent } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== ASSETS QUERIES =====

export async function getAllAssets(): Promise<Asset[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get assets: database not available");
    return [];
  }

  return await db.select().from(assets).orderBy(desc(assets.createdAt));
}

export async function getAssetById(id: string): Promise<Asset | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get asset: database not available");
    return undefined;
  }

  const result = await db.select().from(assets).where(eq(assets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAsset(asset: InsertAsset): Promise<Asset> {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot create asset: database not available");
  }

  await db.insert(assets).values(asset);
  const created = await getAssetById(asset.id);
  if (!created) {
    throw new Error("Failed to retrieve created asset");
  }
  return created;
}

export async function updateAssetStatus(id: string, status: Asset["status"]): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot update asset: database not available");
  }

  await db.update(assets).set({ status }).where(eq(assets.id, id));
}

// ===== EVENTS QUERIES =====

export async function getAllEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get events: database not available");
    return [];
  }

  return await db.select().from(events).orderBy(desc(events.timestamp));
}

export async function getEventsByAssetId(assetId: string): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get events: database not available");
    return [];
  }

  return await db.select().from(events).where(eq(events.assetId, assetId)).orderBy(desc(events.timestamp));
}

export async function createEvent(event: InsertEvent): Promise<Event> {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot create event: database not available");
  }

  const result = await db.insert(events).values(event);
  const insertId = Number(result[0].insertId);
  
  const created = await db.select().from(events).where(eq(events.id, insertId)).limit(1);
  if (!created || created.length === 0) {
    throw new Error("Failed to retrieve created event");
  }
  return created[0];
}
