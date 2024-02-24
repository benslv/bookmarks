import ogs from "open-graph-scraper";

export async function getOGTags(
	url: string
): Promise<{ title?: string; imageUrl?: string }> {
	const data = await ogs({ url });

	if (data.error) {
		return {};
	}

	return {
		title:
			data.result.ogTitle ??
			data.result.dcTitle ??
			data.result.twitterTitle,
		imageUrl:
			data.result.ogImage?.[0].url ?? data.result.twitterImage?.[0].url,
	};
}
