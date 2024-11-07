import * as cheerio from "cheerio";

export async function fetchMetadata(url: string): Promise<{ title: string }> {
	const $ = await cheerio.fromURL(url);

	const head = $("head");

	return {
		title: head.find("title").text(),
	};
}
