import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "Bookmarks + Read Later" },
		{
			name: "description",
			content: "Collect your bookmarks and read them later!",
		},
	];
};

export default function Index() {
	return <div></div>;
}
