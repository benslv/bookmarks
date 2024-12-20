import { type ActionFunctionArgs } from "@remix-run/node";
import { authenticateWithHeaders } from "~/models/auth.server";
import { createBookmark } from "~/models/bookmarks.server";

export async function action({ request }: ActionFunctionArgs) {
	await authenticateWithHeaders(request);

	return await createBookmark(request);
}
