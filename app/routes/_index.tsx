import { type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { desc } from "drizzle-orm";
import { Bookmark } from "~/components/Bookmark";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";

export const meta: MetaFunction = () => {
	return [
		{ title: "Bookmarks + Read Later" },
		{
			name: "description",
			content: "Collect your bookmarks and read them later!",
		},
	];
};

export async function loader() {
	const bookmarks = await db
		.select()
		.from(bookmarksTable)
		.orderBy(desc(bookmarksTable.dateAdded));

	return { bookmarks };
}

export default function Index() {
	const { bookmarks } = useLoaderData<typeof loader>();
	return (
		<div className="flex flex-col gap-y-1 max-w-3xl mx-auto">
			{bookmarks.map((bookmark) => (
				<Bookmark key={bookmark.id} bookmark={bookmark} />
			))}
		</div>
	);
}
