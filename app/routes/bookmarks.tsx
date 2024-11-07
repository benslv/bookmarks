import { ActionFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Bookmark } from "~/components/Bookmark";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { fetchMetadata } from "~/utils/fetchMetadata.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	console.log(Object.fromEntries(formData.entries()));

	const { url } = z
		.object({ url: z.string() })
		.parse(Object.fromEntries(formData.entries()));

	const { title } = await fetchMetadata(url);

	const bookmark = await db.insert(bookmarksTable).values({ url, title });

	return json({ bookmark }, 200);
}

export async function loader() {
	const bookmarks = await db.select().from(bookmarksTable);

	return { bookmarks };
}

export default function Page() {
	const { bookmarks } = useLoaderData<typeof loader>();
	return (
		<div>
			<h1>Bookmarks</h1>
			<div>
				{bookmarks.map((bookmark) => (
					<Bookmark key={bookmark.id} bookmark={bookmark} />
				))}
			</div>
		</div>
	);
}
