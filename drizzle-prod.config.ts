import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import env from "~/utils/env.server";

export default defineConfig({
	out: "./drizzle",
	schema: "./app/db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_TOKEN,
	},
});
