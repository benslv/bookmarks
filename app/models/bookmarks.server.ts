import { json } from "@remix-run/node";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { fetchTitle } from "~/utils/fetchMetadata.server";

const createBookmarkSchema = z.object({
	url: z.string().url(),
	title: z.string().optional(),
	dateAdded: z.coerce.date().optional(),
	folder: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

export async function createBookmark(request: Request) {
	const formData = await request.formData();
	const payload = Object.fromEntries(formData.entries());

	const parseResult = createBookmarkSchema.safeParse(payload);

	if (!parseResult.success) {
		console.error("Parse issue:", parseResult.error);
		return json({ message: "Issue parsing payload." }, 400);
	}

	const { url, dateAdded, folder } = parseResult.data;

	const title = parseResult.data.title ?? (await fetchTitle(url));

	const bookmark = await db
		.insert(bookmarksTable)
		.values({ url, title, dateAdded, folder });

	return json({ bookmark }, 200);
}

const archiveBookmarkSchema = z.object({
	id: z.coerce.number().int().min(1),
});

export async function archiveBookmark(request: Request, formData?: FormData) {
	const data = formData ?? (await request.formData());
	const payload = Object.fromEntries(data.entries());

	const parseResult = archiveBookmarkSchema.safeParse(payload);

	if (!parseResult.success) {
		console.error("Parse issue:", parseResult.error);
		return json({ message: "Issue parsing payload." }, 400);
	}

	const { id } = parseResult.data;

	const bookmark = await db
		.update(bookmarksTable)
		.set({ folder: "archive" })
		.where(eq(bookmarksTable.id, id));

	return json({ bookmark }, 200);
}

export async function getBookmarks(folder?: string) {
	return db
		.select()
		.from(bookmarksTable)
		.where(folder ? eq(bookmarksTable.folder, folder) : undefined)
		.orderBy(desc(bookmarksTable.dateAdded));
}
