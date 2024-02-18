import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getOGTags } from "~/lib/utils.server";
import { prisma } from "~/prisma.server";

const schema = z.object({
	url: z
		.string({ required_error: "A URL is required." })
		.url("URL is invalid."),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	if (submission.status !== "success") {
		return json(submission.reply());
	}

	const { url } = submission.value;

	const { title = "", description = "" } = await getOGTags(url);

	await prisma.bookmark.create({
		data: {
			url,
			title,
			description,
		},
	});

	return redirect("/bookmarks");
}

export default function Page() {
	const lastResult = useActionData<typeof action>();

	const [form, fields] = useForm({
		lastResult,
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
	});

	return (
		<div className="p-4">
			<h1 className="text-3xl font-extrabold">Add New Bookmark</h1>
			<Form method="post" id={form.id} onSubmit={form.onSubmit}>
				<Label htmlFor={fields.url.name}>Site</Label>
				<Input
					type="text"
					name={fields.url.name}
					placeholder="www.example.com"
				/>
				<div className="text-red-700">{fields.url.errors}</div>
				<Button type="submit">Add</Button>
			</Form>
		</div>
	);
}
