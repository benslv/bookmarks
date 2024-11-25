import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import env from "~/utils/env.server";

function getDatabase() {
	if (process.env.NODE_ENV === "production") {
		console.log("Using production database.");

		return drizzle({
			connection: {
				url: env.DATABASE_URL,
				authToken: env.DATABASE_TOKEN,
			},
		});
	} else {
		console.log("Using local database.");

		if (!env.DEV_DATABASE_URL) {
			throw new Error("DEV_DATABASE_URL is not defined in .env");
		}

		return drizzle(env.DEV_DATABASE_URL);
	}
}

const db = getDatabase();

export default db;
