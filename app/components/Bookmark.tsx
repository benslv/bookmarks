import { Link, useFetcher } from "@remix-run/react";

import { type Bookmark } from "~/db/schema";
import { getRelativeTimeString } from "~/utils/getRelativeTimeString";

export function Bookmark({ bookmark }: { bookmark: Bookmark }) {
	const hostname = new URL(bookmark.url).hostname;
	const faviconSrc = `https://icon.horse/icon/${hostname}`;

	const fetcher = useFetcher();

	return (
		<div className="flex items-center gap-x-2">
			<img width={16} height={16} src={faviconSrc} alt="" />
			<div>
				<Link
					to={bookmark.url}
					target="_blank"
					rel="noreferrer"
					className="hover:underline"
				>
					{bookmark.title || bookmark.url}
				</Link>
				<div className="text-stone-500 flex flex-wrap gap-x-1 dark:text-stone-400 text-sm">
					<span title={bookmark.dateAdded.toString()}>
						{getRelativeTimeString(bookmark.dateAdded)}
					</span>
					<span>・</span>
					<Link
						to={new URL(bookmark.url).origin}
						target="_blank"
						rel="noreferrer"
						className="hover:underline"
					>
						{hostname}
					</Link>
					<span>・</span>
					<fetcher.Form method="POST" action="/bookmarks">
						<input type="hidden" name="intent" value="delete" />
						<input type="hidden" name="id" value={bookmark.id} />
						<button type="submit" className="hover:underline">
							mark read
						</button>
					</fetcher.Form>
				</div>
			</div>
		</div>
	);
}
