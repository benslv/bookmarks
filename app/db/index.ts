import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import env from "~/utils/env.server";

const db = drizzle({
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_TOKEN,
	},
});

export default db;
