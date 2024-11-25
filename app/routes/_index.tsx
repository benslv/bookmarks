import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm/sql";
import { useEffect, useRef } from "react";

import { Bookmark } from "~/components/Bookmark";
import { Spinner } from "~/components/Spinner";
import db from "~/db";
import { bookmarksTable } from "~/db/schema";
import { authenticateWithSession } from "~/models/auth.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "Bookmarks + Read Later" },
		{
			name: "description",
			content: "Collect your bookmarks and read them later!",
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	await authenticateWithSession(request);

	const bookmarks = await db
		.select()
		.from(bookmarksTable)
		.where(eq(bookmarksTable.folder, "unread"))
		.orderBy(desc(bookmarksTable.dateAdded));

	return { bookmarks };
}

export default function Index() {
	const formRef = useRef<HTMLFormElement>(null);
	const { bookmarks } = useLoaderData<typeof loader>();
	const [searchParams, setSearchParams] = useSearchParams();

	const searchQuery = searchParams.get("q") ?? "";

	const filtered = bookmarks.filter((bookmark) =>
		bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
			<input
				type="text"
				name="url"
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				placeholder="Search"
				defaultValue={searchQuery}
				className="min-w-0 w-full border bg-white p- px-3 rounded-lg shadow placeholder-stone-300 h-10 outline-offset-1 focus-within:outline-orange-400 dark:bg-stone-700 dark:border-stone-700 dark:placeholder-stone-500"
				onChange={(event) => {
					setSearchParams((prev) => {
						if (event.target.value.length === 0) {
							prev.delete("q");
						} else {
							prev.set("q", event.target.value);
						}

						return prev;
					});
				}}
			/>

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
				{filtered.map((bookmark) => (
					<Bookmark key={bookmark.id} bookmark={bookmark} />
				))}
			</div>
		</div>
	);
}
