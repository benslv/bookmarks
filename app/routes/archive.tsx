import { useLoaderData } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";

import { Bookmark } from "~/components/Bookmark";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";

export async function loader() {
	const bookmarks = await db
		.select()
		.from(bookmarksTable)
		.where(eq(bookmarksTable.folder, "archive"))
		.orderBy(desc(bookmarksTable.dateAdded));

	return { bookmarks };
}

export default function Page() {
	const { bookmarks } = useLoaderData<typeof loader>();

	return (
		<div className="max-w-3xl mx-auto px-4 flex flex-col gap-y-4">
			<div className="flex flex-col gap-y-1">
				<h1>Archive</h1>
				{bookmarks.map((bookmark) => (
					<Bookmark key={bookmark.id} bookmark={bookmark} />
				))}
			</div>
		</div>
	);
}
