import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { prisma } from "~/prisma.server";

const dtf = new Intl.DateTimeFormat("en");

export const meta: MetaFunction = () => {
  return [
    { title: "Bookmarks" },
    { name: "description", content: "Bookmarks app!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const bookmarks = await prisma.bookmark.findMany({
    orderBy: {
      addedAt: "desc",
    },
  });

  return { bookmarks };
}

export default function Index() {
  const { bookmarks } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full p-2">
      {bookmarks.map((bookmark) => {
        return (
          <>
            <Link
              to={bookmark.url}
              key={bookmark.id}
              className="flex gap-x-4 items-center p-2 rounded-md transition-colors hover:bg-gray-100"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=40`}
                width={40}
                height={40}
              />
              <div>
                <h1 className="font-semibold">{bookmark.title}</h1>
                <p className="text-gray-500 text-sm">
                  {new URL(bookmark.url).hostname}
                </p>
              </div>
            </Link>
            <hr />
          </>
        );
      })}

      <Outlet />
    </div>
  );
}
