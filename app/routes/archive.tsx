import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Bookmark } from "~/components/Bookmark";
import { authenticateWithSession } from "~/models/auth.server";
import { getBookmarks } from "~/models/bookmarks.server";

export async function loader({ request }: LoaderFunctionArgs) {
	await authenticateWithSession(request);

	const bookmarks = await getBookmarks("archive");

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
