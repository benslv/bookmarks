import { type MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm/sql";
import { useEffect, useRef } from "react";
import { Bookmark } from "~/components/Bookmark";
import { Spinner } from "~/components/Spinner";
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
		.where(eq(bookmarksTable.status, "unread"))
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
		<div className="max-w-3xl mx-auto px-4 flex flex-col gap-y-4">
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
					className="min-w-0 w-full border border-stone-200 bg-gradient-to-b from-white to-stone-50 p-2 rounded shadow placeholder-stone-300 h-10 outline-offset-1 focus-within:outline-orange-400"
				/>
			</fetcher.Form>

			<div className="flex flex-col gap-y-1">
				{isAdding && (
					<div className="flex items-center gap-x-2">
						<Spinner />
						<p className="inline text-stone-400 font-normal animate-pulse">
							Adding{" "}
							{fetcher.formData?.get("url")?.toString() ?? "link"}
						</p>
					</div>
				)}
				{bookmarks.map((bookmark) => (
					<Bookmark key={bookmark.id} bookmark={bookmark} />
				))}
			</div>
		</div>
	);
}
