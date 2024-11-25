import { Link, useFetcher } from "@remix-run/react";

import { type Bookmark } from "~/db/schema";
import { getRelativeTimeString } from "~/utils/getRelativeTimeString";

export function Bookmark({ bookmark }: { bookmark: Bookmark }) {
	const hostname = new URL(bookmark.url).hostname;
	const faviconSrc = `https://icon.horse/icon/${hostname}`;

	const fetcher = useFetcher();

	const isDeleting = fetcher.state !== "idle";

	return (
		<div
			style={{ opacity: isDeleting ? 0.5 : 1 }}
			className="flex items-center gap-x-2"
		>
			<img
				width={16}
				height={16}
				src={faviconSrc}
				alt=""
				loading="lazy"
			/>
			<div className="w-full">
				<Link
					to={bookmark.url}
					target="_blank"
					rel="noreferrer"
					className="hover:underline hyphens-auto line-clamp-2"
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
					{bookmark.folder === "unread" && (
						<>
							<span>・</span>
							<fetcher.Form method="POST" action="/bookmarks">
								<input
									type="hidden"
									name="intent"
									value="delete"
								/>
								<input
									type="hidden"
									name="id"
									value={bookmark.id}
								/>
								<button
									type="submit"
									className="hover:underline"
									disabled={isDeleting}
								>
									{isDeleting
										? "marking as read"
										: "mark read"}
								</button>
							</fetcher.Form>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
