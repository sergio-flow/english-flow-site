import { apiBaseUrl } from "@/_constants/environment";

type Article = {
    image: string;
    title: string;
    tagsJson: { emoji: string, text: string }[];
    contentJson: [
        {
            [key: string]: string | { text: string }[];
        }
    ]
}

type Params = {
    languageCode: string;
    slug?: string;
}

export default async function fetchSpeakLikeX(params: Params): Promise<Article[] | Article> {
    const { languageCode, slug } = params;

    const response = await fetch(`${apiBaseUrl}/api/fetch-speak-like-x?languageCode=${languageCode}` + (slug ? `&slug=${slug}` : ''), {
        next: { revalidate: 0 * 0.5 }
    }
    );

    return await response.json();
}