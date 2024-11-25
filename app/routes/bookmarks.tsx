import { type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

import { authenticateWithSession } from "~/models/auth.server";
import { archiveBookmark } from "~/models/bookmarks.server";

export async function action({ request }: ActionFunctionArgs) {
	await authenticateWithSession(request);

	const formData = await request.formData();

	const intent = z.enum(["delete"]).parse(formData.get("intent"));

	switch (intent) {
		case "delete": {
			return await archiveBookmark(request, formData);
		}
		default: {
			return null;
		}
	}
}
