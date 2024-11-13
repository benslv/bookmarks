import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "~/session.server";
import { validateToken } from "~/utils/validateToken.server";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const token = formData.get("token");

	if (!token) return null;

	const authorized = validateToken(String(token));

	if (!authorized) {
		return json({ error: "Incorrect token." }, 401);
	}

	const session = await getSession(request.headers.get("Cookie"));

	session.set("token", token);

	return redirect("/", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
}

export default function Page() {
	const data = useActionData<typeof action>();

	return (
		<div className="max-w-xl mx-auto">
			<h1 className="mb-2">Enter authorization token:</h1>
			<Form method="POST" className="flex gap-x-2">
				<input
					type="password"
					name="token"
					placeholder="Token"
					required
					className="min-w-0 w-full border bg-white px-3 rounded-lg shadow placeholder-stone-300 h-10 outline-offset-1 focus-within:outline-orange-400 dark:bg-stone-700 dark:border-stone-700 dark:placeholder-stone-500"
				/>
				<button
					type="submit"
					className="bg-orange-400 rounded-lg text-stone-800 hover:bg-orange-300 px-3 font-semibold shadow"
				>
					Submit
				</button>
			</Form>
			{data?.error && <p className="text-red-400 mt-2">{data.error}</p>}
		</div>
	);
}
