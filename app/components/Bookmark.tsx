import { Link } from "@remix-run/react";
import { type Bookmark } from "~/db/schema";
import { getRelativeTimeString } from "~/utils/getRelativeTimeString";

export function Bookmark({ bookmark }: { bookmark: Bookmark }) {
	const hostname = new URL(bookmark.url).hostname;
	const faviconSrc = `https://icon.horse/icon/${hostname}`;

	return (
		<div className="flex items-baseline">
			<img
				width={16}
				height={16}
				src={faviconSrc}
				alt=""
				className="inline mr-2 self-center"
			/>
			<Link to={bookmark.url} className="hover:underline">
				{bookmark.title || bookmark.url}
			</Link>
			<span className="text-stone-500 text-sm ml-2">
				{getRelativeTimeString(bookmark.dateAdded)}
			</span>
		</div>
	);
}
