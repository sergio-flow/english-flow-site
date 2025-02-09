import { apiBaseUrl } from "@/_constants/environment";

type Article = {
    image: string;
    title: string;
    slug: string;
    tagsJson: { emoji: string, text: string }[];
    contentJson: [
        {
            [key: string]: string | { text: string }[];
        }
    ]
}

type Params = {
    languageCode: string;
}

export default async function fetchAllSpeakLike(params: Params): Promise<Article[]> {
    const { languageCode } = params;

    const response = await fetch(`${apiBaseUrl}/api/fetch-all-speak-like?languageCode=${languageCode}`, {
        next: { revalidate: 0 * 0.5 }
    }
    );

    return await response.json();
}