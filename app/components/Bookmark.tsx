import { Link, useFetcher } from "@remix-run/react";
import { type Bookmark } from "~/db/schema";
import { getRelativeTimeString } from "~/utils/getRelativeTimeString";

export function Bookmark({ bookmark }: { bookmark: Bookmark }) {
	const hostname = new URL(bookmark.url).hostname;
	const faviconSrc = `https://icon.horse/icon/${hostname}`;

	const fetcher = useFetcher();

	return (
		<div className="group flex items-center gap-x-2">
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
				<span className="text-stone-500 text-sm ml-2 whitespace-nowrap">
					{getRelativeTimeString(bookmark.dateAdded)}
				</span>
				<fetcher.Form
					method="POST"
					action="/bookmarks"
					className="hidden group-hover:inline ml-2"
				>
					<input type="hidden" name="intent" value="delete" />
					<input type="hidden" name="id" value={bookmark.id} />
					<button type="submit" className="text-green-500 font-bold">
						✓
					</button>
				</fetcher.Form>
			</div>
		</div>
	);
}
