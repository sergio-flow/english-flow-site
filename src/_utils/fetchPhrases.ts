import { apiBaseUrl } from "@/_constants/environment";

type Params = {
    countryCode?: string;
    languageCode: string;
    gender?: string;
    accent?: string;
    conversation?: string;
    phraseIds?: (string | number)[];
}

export default async function fetchPhrases(params: Params) {
    const addToQuery = (key: string, value: string | number) => `${key}=${value}`;

    const query = Object.entries(params)
        .filter(([, value]) => value)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => addToQuery(key, v)).join('&');
            }

            return addToQuery(key, value);
        })
        .join('&');

    const response = await fetch(`${apiBaseUrl}/api/fetch-phrases?` + query, { next: { revalidate: 3600 * 0.5 } });

    const { phrases } = await response.json();

    return phrases;
}