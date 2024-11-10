import { type MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { desc } from "drizzle-orm";
import { useEffect, useRef } from "react";
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
	const formRef = useRef<HTMLFormElement>(null);
	const { bookmarks } = useLoaderData<typeof loader>();

	const fetcher = useFetcher();
	const isAdding =
		fetcher.state === "submitting" &&
		fetcher.formData?.get("intent") === "create";

	useEffect(() => {
		if (!isAdding) {
			formRef.current?.reset();
		}
	}, [isAdding]);

	return (
		<div className="max-w-3xl mx-auto px-4 flex flex-col gap-y-4 my-4">
			<fetcher.Form
				ref={formRef}
				className="flex"
				method="POST"
				action="/bookmarks"
			>
				<input type="hidden" name="intent" value="create" />
				<input
					type="text"
					name="url"
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					required
					placeholder="https://interesting-article.com"
					className="bg-inherit min-w-0 w-full border p-1 rounded-tl rounded-bl border-r-0"
				/>
				<button
					type="submit"
					className="bg-orange-300 text-orange-50 hover:bg-orange-400 px-2 rounded-tr rounded-br"
				>
					+
				</button>
			</fetcher.Form>

			<div className="flex flex-col gap-y-1">
				{bookmarks.map((bookmark) => (
					<Bookmark key={bookmark.id} bookmark={bookmark} />
				))}
			</div>
		</div>
	);
}
