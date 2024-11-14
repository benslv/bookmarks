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

		return drizzle("file:local.db");
	}
}

const db = getDatabase();

export default db;
