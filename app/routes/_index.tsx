import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

import { prisma } from "~/prisma.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "Bookmarks" },
		{ name: "description", content: "Bookmarks app!" },
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const bookmarks = await prisma.bookmark.findMany();

	return { bookmarks };
}

export default function Index() {
	const { bookmarks } = useLoaderData<typeof loader>();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[32px]"></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Link</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{bookmarks.map((bookmark, i) => {
					const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=16`;
					return (
						<TableRow key={i}>
							<TableCell>
								<img src={faviconUrl} width={16} height={16} />
							</TableCell>
							<TableCell>
								<p className="font-semibold">
									{bookmark.title || bookmark.url}
								</p>
							</TableCell>
							<TableCell>
								<a
									href={bookmark.url}
									target="_blank"
									className="text-gray-600"
								>
									{new URL(bookmark.url).hostname}
								</a>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);

	// return (
	// 	<div>
	// 		{bookmarks.map((bookmark, i) => {
	// 			const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`;

	// 			return (
	// 				<div
	// 					key={`${bookmark.url}-${i}`}
	// 					className="flex gap-x-4 items-center"
	// 				>
	// 					<img src={faviconUrl} />
	// 					<p>{bookmark.url}</p>
	// 				</div>
	// 			);
	// 		})}
	// 	</div>
	// );
}
