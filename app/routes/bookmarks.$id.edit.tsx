import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { prisma } from "~/prisma.server";

const bookmarkSchema = z.object({
	url: z.string(),
	title: z.string().optional(),
});

export async function loader({ params }: LoaderFunctionArgs) {
	const result = z.coerce.number().safeParse(params.id);

	if (!result.success) {
		throw redirect("/bookmarks");
	}

	const id = result.data;

	const bookmark = await prisma.bookmark.findUnique({
		where: { id },
	});

	if (!bookmark) {
		throw new Error("Bookmark not found.");
	}

	return { bookmark };
}

export async function action({ params, request }: ActionFunctionArgs) {
	const result = z.coerce.number().safeParse(params.id);

	if (!result.success) {
		throw redirect("/bookmarks");
	}

	const id = result.data;

	const formData = await request.formData();

	const submission = parseWithZod(formData, { schema: bookmarkSchema });

	if (submission.status !== "success") {
		return json(submission.reply());
	}

	const { title, url } = submission.value;

	await prisma.bookmark.update({
		where: { id },
		data: {
			title,
			url,
		},
	});

	return redirect("/bookmarks");
}

export default function Page() {
	const { bookmark } = useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();

	const [form, fields] = useForm({
		lastResult,
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: bookmarkSchema });
		},
		shouldValidate: "onBlur",
	});

	return (
		<AlertDialog open>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Edit</AlertDialogTitle>
				</AlertDialogHeader>

				<Form
					method="post"
					id={form.id}
					onSubmit={form.onSubmit}
					className="flex flex-col gap-y-2 mb-4"
				>
					<fieldset>
						<Label htmlFor={fields.url.name}>URL</Label>
						<Input
							type="text"
							name={fields.url.name}
							defaultValue={bookmark.url}
						/>
						<div className="text-red-700 text-sm">
							{fields.url.errors}
						</div>
					</fieldset>
					<fieldset>
						<Label htmlFor={fields.title.name}>Title</Label>
						<Input
							type="text"
							name={fields.title.name}
							defaultValue={bookmark.title}
						/>
						<div className="text-red-700 text-sm">
							{fields.title.errors}
						</div>
					</fieldset>
				</Form>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button variant="ghost" asChild>
							<Link to=".." replace>
								Close
							</Link>
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction type="submit" form={form.id}>
						Save
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
