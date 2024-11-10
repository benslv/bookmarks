import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { fetchMetadata } from "~/utils/fetchMetadata.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const { url } = z
		.object({ url: z.string() })
		.parse(Object.fromEntries(formData.entries()));

	const { title } = await fetchMetadata(url);

	const bookmark = await db.insert(bookmarksTable).values({ url, title });

	return json({ bookmark });
}
