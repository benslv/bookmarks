import ogs from "open-graph-scraper";

export async function getOGTags(
	url: string
): Promise<{ title?: string; description?: string }> {
	const data = await ogs({ url });

	if (data.error) {
		return {};
	}

	return {
		title:
			data.result.ogTitle ??
			data.result.dcTitle ??
			data.result.twitterTitle,
		description:
			data.result.ogDescription ??
			data.result.dcDescription ??
			data.result.twitterDescription,
	};
}
