import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { secretEnv } from "../env";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | undefined;

export function getDb() {
 if (!_db) {
  _db = drizzle(secretEnv.DATABASE_URL, { schema });
 }

 return _db;
}
