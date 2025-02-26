import { apiBaseUrl } from "@/_constants/environment";

type AllTexts = { [key: string]: { [key: string]: string } };

type Params = {
    countryCode?: string;
    languageCode?: string;
    allTexts: AllTexts;
}

export default async function resolveTranslations(params: Params) {
    const response = await fetch(`${apiBaseUrl}/api/resolve-translations`, {
        next: { revalidate: 3600 * 0.5 },
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    const { allTexts } = await response.json();

    // const newObjToReturn: TranslationsObject = {}

    // for (const text of allTexts) {
    //     newObjToReturn[text.name] = text.translated_json;
    // }

    return allTexts;
}

// type TranslationsObject = {
//     [key: string]: {
//         [key: string]: string;
//     }
// }