import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
 createdAt: timestamp("created_at").defaultNow().notNull(),
 email: text("email").notNull().unique(),
 emailVerified: boolean("email_verified").default(false).notNull(),
 id: text("id").primaryKey(),
 image: text("image"),
 name: text("name").notNull(),
 twoFactorEnabled: boolean("two_factor_enabled").default(false),
 updatedAt: timestamp("updated_at")
  .defaultNow()
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull(),
});

export const session = pgTable(
 "session",
 {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  id: text("id").primaryKey(),
  ipAddress: text("ip_address"),
  token: text("token").notNull().unique(),
  updatedAt: timestamp("updated_at")
   .$onUpdate(() => /* @__PURE__ */ new Date())
   .notNull(),
  userAgent: text("user_agent"),
  userId: text("user_id")
   .notNull()
   .references(() => user.id, { onDelete: "cascade" }),
 },
 (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
 "account",
 {
  accessToken: text("access_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  accountId: text("account_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  id: text("id").primaryKey(),
  idToken: text("id_token"),
  password: text("password"),
  providerId: text("provider_id").notNull(),
  refreshToken: text("refresh_token"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  updatedAt: timestamp("updated_at")
   .$onUpdate(() => /* @__PURE__ */ new Date())
   .notNull(),
  userId: text("user_id")
   .notNull()
   .references(() => user.id, { onDelete: "cascade" }),
 },
 (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
 "verification",
 {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  updatedAt: timestamp("updated_at")
   .defaultNow()
   .$onUpdate(() => /* @__PURE__ */ new Date())
   .notNull(),
  value: text("value").notNull(),
 },
 (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const apiKeys = pgTable(
 "api_keys",
 {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  encryptedApiKey: text("encrypted_api_key").notNull(),
  encryptedApiSecret: text("encrypted_api_secret").notNull(),
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  maskedKey: text("masked_key").notNull(),
  testnet: boolean("testnet").notNull().default(false),
  updatedAt: timestamp("updated_at")
   .defaultNow()
   .$onUpdate(() => /* @__PURE__ */ new Date())
   .notNull(),
  userId: text("user_id")
   .notNull()
   .references(() => user.id, { onDelete: "cascade" }),
 },
 (table) => [index("apiKeys_userId_idx").on(table.userId)],
);

export const twoFactor = pgTable(
 "two_factor",
 {
  backupCodes: text("backup_codes").notNull(),
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  userId: text("user_id")
   .notNull()
   .references(() => user.id, { onDelete: "cascade" }),
  verified: boolean("verified").default(true),
 },
 (table) => [
  index("twoFactor_secret_idx").on(table.secret),
  index("twoFactor_userId_idx").on(table.userId),
 ],
);

export const userRelations = relations(user, ({ many }) => ({
 accounts: many(account),
 apiKeys: many(apiKeys),
 sessions: many(session),
 twoFactors: many(twoFactor),
}));

export const sessionRelations = relations(session, ({ one }) => ({
 user: one(user, {
  fields: [session.userId],
  references: [user.id],
 }),
}));

export const accountRelations = relations(account, ({ one }) => ({
 user: one(user, {
  fields: [account.userId],
  references: [user.id],
 }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
 user: one(user, {
  fields: [apiKeys.userId],
  references: [user.id],
 }),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
 user: one(user, {
  fields: [twoFactor.userId],
  references: [user.id],
 }),
}));
