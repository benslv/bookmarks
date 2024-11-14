import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const bookmarksTable = sqliteTable("bookmarks_table", {
	id: int().primaryKey({ autoIncrement: true }),
	url: text().notNull(),
	title: text().notNull(),
	dateAdded: int({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	folder: text().notNull().default("unread"),
	tags: text({ mode: "json" }).$type<string[]>().notNull().default([]),
});

export const selectBookmarkSchema = createSelectSchema(bookmarksTable);

export type Bookmark = z.infer<typeof selectBookmarkSchema>;
