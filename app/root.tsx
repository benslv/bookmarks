import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
	},
	{ rel: "stylesheet", href: styles },
];

export default function App() {
	return (
		<html lang="en" className="font-sans">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="flex h-screen">
					<div className="w-64 min-w-64 h-screen bg-gray-100 border-r border-gray-200 flex flex-col p-4 gap-y-4">
						<h1 className="font-bold">Bookmarks</h1>
						<Link to="/bookmarks">Bookmarks</Link>
						<Link to="/add">Add</Link>
					</div>
					<Outlet />
				</div>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
