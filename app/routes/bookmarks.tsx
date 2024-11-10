import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { fetchMetadata } from "~/utils/fetchMetadata.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const parseResult = z
		.object({ url: z.string().url() })
		.safeParse(Object.fromEntries(formData.entries()));

	if (!parseResult.success) {
		return null;
	}

	const { url } = parseResult.data;

	const { title } = await fetchMetadata(url);

	const bookmark = await db.insert(bookmarksTable).values({ url, title });

	return json({ bookmark });
}
