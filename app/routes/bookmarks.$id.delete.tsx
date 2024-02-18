import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { z } from "zod";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { prisma } from "~/prisma.server";

const bookmarkSchema = z.object({
	url: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
});

export async function loader({ params }: LoaderFunctionArgs) {
	const result = z.coerce.number().safeParse(params.id);

	if (!result.success) {
		throw redirect("/bookmarks");
	}

	return null;
}

export async function action({ params, request }: ActionFunctionArgs) {
	const result = z.coerce.number().safeParse(params.id);

	if (!result.success) {
		throw redirect("/bookmarks");
	}

	const id = result.data;

	const formData = await request.formData();
	const intentParse = z.string().safeParse(formData.get("intent"));

	if (!intentParse.success) {
		throw redirect("/bookmarks");
	}

	const intent = intentParse.data;

	if (intent === "delete") {
		await prisma.bookmark.delete({
			where: { id },
		});
	}

	return redirect("/bookmarks");
}

export default function Page() {
	return (
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this bookmark?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button variant="ghost" asChild>
							<Link to=".." replace>
								Close
							</Link>
						</Button>
					</AlertDialogCancel>
					<Form method="post">
						<Input type="hidden" name="intent" value="delete" />
						<Button type="submit" variant="destructive">
							Delete
						</Button>
					</Form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
