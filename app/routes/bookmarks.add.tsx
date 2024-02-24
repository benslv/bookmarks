import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { z } from "zod";

import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { getOGTags } from "~/lib/utils.server";
import { prisma } from "~/prisma.server";

const schema = z.object({
	url: z
		.string({ required_error: "A URL is required." })
		.url("URL is invalid."),
});

export async function action({ request }: ActionFunctionArgs) {
	console.log("hello!");
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	if (submission.status !== "success") {
		return json(submission.reply());
	}

	const { url } = submission.value;

	console.log(url);

	const { title = "", imageUrl = "" } = await getOGTags(url);

	await prisma.bookmark.create({
		data: {
			url,
			title,
			imageUrl,
			addedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	});

	return redirect("/bookmarks");
}

export default function Page() {
	const lastResult = useActionData<typeof action>();
	const navigate = useNavigate();

	const [form, fields] = useForm({
		lastResult,
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
	});

	return (
		<Dialog defaultOpen>
			<DialogContent
				onEscapeKeyDown={() => navigate("..")}
				onInteractOutside={() => navigate("..")}
			>
				<Form method="post">
					<Input
						type="text"
						name={fields.url.name}
						placeholder="Paste the link here..."
					/>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
