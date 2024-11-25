import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import env from "~/utils/env.server";

export default defineConfig({
	out: "./drizzle",
	schema: "./app/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DEV_DATABASE_URL!,
	},
});
