import { apiBaseUrl } from "@/_constants/environment";

type Article = {
    image: string;
    title: string;
    content: string;
}

export default async function fetchSpeakLikeX(): Promise<Article[]> {
    const response = await fetch(`${apiBaseUrl}/api/fetch-speak-like-x`, { next: { revalidate: 0 * 0.5 } });

    const { articles } = await response.json();

    return articles;
}