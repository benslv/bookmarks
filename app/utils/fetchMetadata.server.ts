import * as cheerio from "cheerio";

export async function fetchTitle(url: string): Promise<string> {
	const $ = await cheerio.fromURL(url);

	const head = $("head");

	return head.find("title").text();
}
