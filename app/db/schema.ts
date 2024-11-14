import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const bookmarksTable = sqliteTable("bookmarks_table", {
	id: int().primaryKey({ autoIncrement: true }),
	url: text().notNull(),
	title: text().notNull(),
	dateAdded: int({ mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
	folder: text().default("unread").notNull(),
	tags: text({ mode: "json" }).$type<string[]>().default([]).notNull(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarksTable).extend({
	url: z.string().url(),
	dateAdded: z.coerce.date(),
});

export const selectBookmarkSchema = createSelectSchema(bookmarksTable);

export type Bookmark = z.infer<typeof selectBookmarkSchema>;
