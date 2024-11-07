import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const bookmarksTable = sqliteTable("bookmarks_table", {
	id: int().primaryKey({ autoIncrement: true }),
	url: text().notNull(),
	title: text().notNull(),
	dateCreated: int({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertBookmarkSchema = createInsertSchema(bookmarksTable);

export const selectBookmarkSchema = createSelectSchema(bookmarksTable);

export type Bookmark = z.infer<typeof selectBookmarkSchema>;
