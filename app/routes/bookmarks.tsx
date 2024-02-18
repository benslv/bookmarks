import { TrashIcon } from "@heroicons/react/24/outline";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
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
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-8"></TableHead>
						<TableHead>Title</TableHead>
						<TableHead>Link</TableHead>
						<TableHead className="w-8"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{bookmarks.map((bookmark, i) => {
						const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=16`;
						return (
							<TableRow key={i} className="group">
								<TableCell>
									<img
										src={faviconUrl}
										width={16}
										height={16}
									/>
								</TableCell>
								<TableCell>
									<a
										href={bookmark.url}
										target="_blank"
										className="font-semibold"
									>
										{bookmark.title || bookmark.url}
									</a>
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
								<TableCell className="ml-auto group-hover:opacity-100 opacity-0">
									<div className="flex gap-x-2">
										<Button
											variant="outline"
											className="h-6"
											asChild
										>
											<Link
												replace
												to={`./${bookmark.id}/edit`}
											>
												Edit
											</Link>
										</Button>
										<Button
											variant="outline"
											className="h-6 w-12"
										>
											<TrashIcon />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			<Outlet />
		</>
	);
}
