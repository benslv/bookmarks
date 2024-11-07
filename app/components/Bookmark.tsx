import { Link } from "@remix-run/react";
import { type Bookmark } from "~/db/schema";

export function Bookmark({ bookmark }: { bookmark: Bookmark }) {
	return (
		<div>
			<Link to={bookmark.url}>{bookmark.title || bookmark.url}</Link>
			<span>{bookmark.dateCreated?.toLocaleDateString()}</span>
		</div>
	);
}
