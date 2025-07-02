import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import config from "../config";

/**
 * Create a client to connect to the database.
 */
const client = createClient({
  url: config.urlDB as string,
  authToken: config.tokenDB as string,
})

export const db = drizzle({ client });