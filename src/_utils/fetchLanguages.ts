import { apiBaseUrl } from "@/_constants/environment";

type Language = {
    languageLocalName: string;
    languageCode: string;
    countryCode: string;
}

type Country = {
    countryName: string;
    countryCode: string;
    languages: Language[]
}

type Continent = {
    continentName: string;
    countries: Country[]
}

type Fetched = {
    continents: Continent[];
    languages: Language[];
}

export default async function fetchLanguages(): Promise<Fetched> {
    const response = await fetch(`${apiBaseUrl}/api/fetch-languages`);

    const { continents, languages } = await response.json();

    return {
        continents,
        languages
    };
}