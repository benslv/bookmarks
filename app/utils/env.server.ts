import * as v from "valibot";

const envSchema = v.object({
	DEV_DATABASE_URL: v.pipe(
		v.string(),
		v.nonEmpty("Dev Database connection URL hasn't been supplied in .env")
	),
	DATABASE_URL: v.pipe(
		v.string(),
		v.nonEmpty("Database connection URL hasn't been supplied in .env")
	),
	DATABASE_TOKEN: v.pipe(
		v.string(),
		v.nonEmpty("Database Token hasn't been supplied in .env")
	),
	AUTH_TOKEN: v.pipe(
		v.string(),
		v.nonEmpty("Application auth token hasn't been provided in .env")
	),
	SESSION_SECRET: v.pipe(
		v.string(),
		v.nonEmpty("Session secret hasn't been supplied in .env")
	),
});

const env = v.parse(envSchema, process.env);

export default env;
