type AllTexts = { [key: string]: { [key: string]: string } };

type Params = {
    countryCode: string;
    languageCode: string;
    allTexts: AllTexts;
}

export default async function resolveTranslations(params: Params) {
    const response = await fetch('http://localhost:3000/api/resolve-translations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    const { allTexts } = await response.json();

    return allTexts;
}