import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from "@supabase/supabase-js";
import * as deepl from 'deepl-node';
import redisClient from 'redis';

const projectID = process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!projectID || !anonKey) {
    throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(`https://${projectID}.supabase.co`, anonKey);

const redis = await redisClient.createClient({ url: process.env.REDIS_URL }).connect();

type BodyParams = {
    // countryCode: string;
    languageCode: deepl.TargetLanguageCode;
    allTexts: any;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { languageCode, allTexts } = request.body as BodyParams;

    const objectKeys = Object.keys(allTexts);
    const redisKey = `${languageCode}-${objectKeys.join('-')}-v1`;

    const value = await redis.get(redisKey);

    if (value) {
        console.log("Returning from Redis");

        return response.status(200).json({
            allTexts: JSON.parse(value)
        });
    }

    let allTextValues: string[] = [];
    for (const key in allTexts) {
        allTextValues = [...allTextValues, ...Object.values(<string[]>allTexts[key])];
    }

    const textKeys = Object.keys(allTexts);

    const translatedLines: any = await supabase
        .from('translated_lines')
        .select('*')
        // .eq('target_country_code', countryCode.toUpperCase())
        .eq('target_language_code', languageCode.toLowerCase())
        .in('english_text', allTextValues);

    const missingTexts = allTextValues.filter((text) => !translatedLines.data.some((line: any) => line.english_text === text));

    let translations: any = [];
    if (missingTexts.length) {
        console.log("Missing texts", missingTexts)

        translations = await Promise.all(missingTexts.map((text) => translate(text, languageCode)));

        const newTranslations = translations.map((translation: any) => {
            return {
                // target_country_code: countryCode.toUpperCase(),
                target_language_code: languageCode.toLowerCase(),
                translated_text: translation.translated_text,
                english_text: translation.english_text
            }
        });

        await supabase.from('translated_lines').upsert(newTranslations);
    }

    const newTexts: any = {}

    for (const key of textKeys) {
        newTexts[key] = {}

        for (const key2 in allTexts[key]) {
            const text = allTexts[key][key2];

            const translation: any = translations.find((t: any) => t.english_text === text);
            if (translation) {
                newTexts[key][key2] = translation.translated_text;
            } else {
                const line = translatedLines.data.find((line: any) => line.english_text === text);
                if (line) {
                    newTexts[key][key2] = line.translated_text;
                }
            }
        }
    }

    await redis.set(redisKey, JSON.stringify(newTexts), {
        EX: 60 * 60 * 24 // 24 hours
    });

    return response.status(200).json({ allTexts: newTexts });
}

const authKey = <string>process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

const translate = (englishText: string, target: deepl.TargetLanguageCode, options?: deepl.TranslateTextOptions) => new Promise((resolve, reject) => {
    console.log('Translating:', englishText);
    translator.translateText(englishText, "en", target, options)
        .then(({ text }) => {
            resolve({
                english_text: englishText,
                translated_text: text
            });
        })
        .catch((err) => {
            reject(err);
        });
});

// async function handler2(request, response) {
//     const { editionDate, search } = request.query
//     let phraseEntries = []
//     // const entries = await getEntries('phrases');
//     // const phrases = entries.items.map(o => stripLocale(o.fields))
//     // search by: fields.speaker.fields.englishType, fields.speaker.fields.name, fields.phrase

//     if (search && search.length > 0) {
//         const searchTexts = search.split('|')

//         const byText = searchTexts.map((text) =>
//             client.getEntries({
//                 content_type: 'phrases',
//                 'fields.phrase[match]': text,
//             }));

//         const results = await Promise.all(byText);

//         phraseEntries = results.flatMap((res) => res.items);
//     } else {
//         phraseEntries = await client.getEntries({
//             content_type: 'phrases',
//             'fields.editionDate': editionDate || new Date().toISOString().split('T')[0]
//         })
//         phraseEntries = phraseEntries.items
//     }

//     // filter phraseEntries unique by phrase
//     phraseEntries = phraseEntries.filter((phrase, index, self) =>
//         index === self.findIndex((t) => (
//             t.fields.phrase === phrase.fields.phrase
//         ))
//     )

//     const prettyDate = new Date(editionDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

//     const phrases = phraseEntries.map(o => {
//         return {
//             phrase: o.fields.phrase,
//             parts: o.fields.parts.parts,
//             audio: `https:${o.fields.audio.fields.file.url}`,
//             englishType: o.fields.speaker.fields.englishType,
//             englishTypeEmojiClass: getLanguageEmojiClass(o.fields.speaker.fields.englishType),
//             sourceType: o.fields.sourceType,
//             sourceUrl: o.fields.sourceUrl,
//             speaker: {
//                 avatar: `https:${o.fields.speaker.fields.avatar.fields.file.url}`,
//                 name: o.fields.speaker.fields.name
//             },
//             category: o.fields.category || prettyDate,
//         }
//     })

//     return response.status(200).json({ phrases });
// }

// const getLanguageEmojiClass = (language) => {
//     if (language.includes('American')) return 'em-us'
//     if (language.includes('British')) return 'em-gb'
//     if (language.includes('Australian')) return 'em-au'
//     if (language.includes('Canadian')) return 'em-ca'
//     if (language.includes('New Zealand')) return 'em-nz'
//     if (language.includes('South African')) return 'em-za'
//     if (language.includes('Irish')) return 'em-ie'
//     if (language.includes('Scottish')) return 'em-sc'
//     return 'em-us'
// }
