import { apiBaseUrl } from "@/_constants/environment";

type Params = {
    countryCode: string;
    languageCode: string;
    gender: string;
    accent: string;
    conversation: string;
}

export default async function fetchPhrases(params: Params) {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value)
    );

    const query = new URLSearchParams(cleanParams).toString();

    const response = await fetch(`${apiBaseUrl}/api/fetch-phrases?` + query, { next: { revalidate: 3600 } });

    const { phrases } = await response.json();

    return phrases;
}