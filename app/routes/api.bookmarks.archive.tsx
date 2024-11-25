import { type ActionFunctionArgs } from "@remix-run/node";
import { authenticateWithHeaders } from "~/models/auth.server";
import { archiveBookmark } from "~/models/bookmarks.server";

export async function action({ request }: ActionFunctionArgs) {
	await authenticateWithHeaders(request);

	return await archiveBookmark(request);
}
