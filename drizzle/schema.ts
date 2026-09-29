import {
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const financialProfiles = mysqlTable("financialProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id).unique(),
  creditScore: int("creditScore").notNull(),
  monthlyIncome: int("monthlyIncome").notNull(),
  monthlyExpenses: int("monthlyExpenses").notNull(),
  outstandingDebt: int("outstandingDebt").notNull(),
  creditLimit: int("creditLimit").notNull(),
  activeLoans: int("activeLoans").notNull(),
  missedPayments: int("missedPayments").notNull(),
  dtiRatio: decimal("dtiRatio", { precision: 10, scale: 4 }).notNull(),
  utilizationRatio: decimal("utilizationRatio", { precision: 10, scale: 4 }).notNull(),
  healthStatus: varchar("healthStatus", { length: 20 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const scoreHistories = mysqlTable("scoreHistories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  creditScore: int("creditScore").notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const recommendations = mysqlTable("recommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  summary: text("summary").notNull(),
  steps: json("steps").$type<string[]>().notNull(),
  riskFlags: json("riskFlags").$type<string[]>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type FinancialProfile = typeof financialProfiles.$inferSelect;
export type ScoreHistory = typeof scoreHistories.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
