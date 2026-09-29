import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  financialProfiles,
  InsertUser,
  recommendations,
  scoreHistories,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

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
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getFinancialProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(financialProfiles)
    .where(eq(financialProfiles.userId, userId))
    .limit(1);
  return result[0];
}

export async function upsertFinancialProfile(values: typeof financialProfiles.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.insert(financialProfiles).values(values).onDuplicateKeyUpdate({
    set: {
      creditScore: values.creditScore,
      monthlyIncome: values.monthlyIncome,
      monthlyExpenses: values.monthlyExpenses,
      outstandingDebt: values.outstandingDebt,
      creditLimit: values.creditLimit,
      activeLoans: values.activeLoans,
      missedPayments: values.missedPayments,
      dtiRatio: values.dtiRatio,
      utilizationRatio: values.utilizationRatio,
      healthStatus: values.healthStatus,
      updatedAt: new Date(),
    },
  });
}

export async function addScoreHistory(userId: number, creditScore: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.insert(scoreHistories).values({ userId, creditScore });
}

export async function getScoreHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(scoreHistories)
    .where(eq(scoreHistories.userId, userId))
    .orderBy(desc(scoreHistories.recordedAt));
}

export async function addRecommendation(values: typeof recommendations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.insert(recommendations).values(values);
}

export async function getRecommendations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(recommendations)
    .where(eq(recommendations.userId, userId))
    .orderBy(desc(recommendations.createdAt));
}
