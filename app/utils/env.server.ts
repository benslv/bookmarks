import { z } from "zod";

const envSchema = z.object({
	DEV_DATABASE_URL: z
		.string()
		.min(1, "Dev Database connection URL hasn't been supplied in .env"),
	DATABASE_URL: z
		.string()
		.min(1, "Database connection URL hasn't been supplied in .env"),
	DATABASE_TOKEN: z
		.string()
		.min(1, "Database Token hasn't been supplied in .env"),
	AUTH_TOKEN: z
		.string()
		.min(1, "Application auth token hasn't been provided in .env"),
	SESSION_SECRET: z
		.string()
		.min(1, "Session secret hasn't been supplied in .env"),
});

const env = envSchema.parse(process.env);

export default env;
