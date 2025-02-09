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

type QueryParams = {
    // countryCode: string;
    languageCode: deepl.TargetLanguageCode;
    gender: string;
    accent: string;
    conversation: string;
    page?: string | number;
    phraseIds?: [string | number];
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { languageCode, gender, accent, conversation, page, phraseIds } = request.query as QueryParams;

    const redisKeys = [
        languageCode,
        gender || "all",
        accent || "all",
        conversation || "all",
        page || "3",
        phraseIds ? phraseIds.join('-') : "all"
    ]

    const redisKey = redisKeys.join('-');

    const value = await redis.get(redisKey);

    if (value) {
        console.log("Returning from Redis");

        return response.status(200).json({
            phrases: JSON.parse(value)
        });
    }

    const pageQuery = page ? parseInt(page as string) : 1;
    const offset = (pageQuery - 1) * 24;
    const offsetEnd = offset + 23;

    let supabaseQuery = supabase
        .from('phrases')
        .select('*')
        .not('word_groups', 'is', null)
        .not('short_description', 'is', null)
        .order('id', { ascending: false })
        .range(offset, offsetEnd)

    if (gender) supabaseQuery = supabaseQuery.eq('gender', gender)
    if (accent) supabaseQuery = supabaseQuery.eq('accent', accent)
    if (conversation) supabaseQuery = supabaseQuery.eq('conversation', conversation)
    if (phraseIds) supabaseQuery = supabaseQuery.in('id', phraseIds)

    const { data, error } = await supabaseQuery;

    const shortDescriptions = (data || []).map(({ short_description }: { short_description: string }) => short_description)
    const uniqueShortDescriptions = [...new Set(shortDescriptions)]

    const { data: translations, error: translationError }: any = await supabase
        .from('translated_lines')
        .select('english_text,translated_text')
        // .eq('target_country_code', countryCode.toUpperCase())
        .eq('target_language_code', languageCode.toLowerCase())
        .in('english_text', shortDescriptions)

    const missingTexts = uniqueShortDescriptions.filter((text) => !translations.some((line: any) => line.english_text === text));

    let resolveNewTranslations: any = [];
    if (missingTexts.length) {
        console.log("Missing texts", missingTexts)
        resolveNewTranslations = await Promise.all(missingTexts.map((text) => translate(text, languageCode)));

        const newTranslations = resolveNewTranslations.map((translation: any) => {
            return {
                // target_country_code: countryCode.toUpperCase(),
                target_language_code: languageCode.toLowerCase(),
                translated_text: translation.translated_text,
                english_text: translation.english_text
            }
        });

        await supabase.from('translated_lines').upsert(newTranslations);
    }

    const allTranslations = [...translations, ...resolveNewTranslations]

    const resolvedPhrases = (data || []).map((phrase) => {
        const { short_description } = phrase
        const translation = allTranslations.find(({ english_text }: any) => english_text === short_description)
        return {
            ...phrase,
            short_description: translation?.translated_text || short_description
        }
    })

    await redis.set(redisKey, JSON.stringify(resolvedPhrases), {
        EX: 60 * 60 * 0.5 // 24 hours
    })

    return response.status(200).json({
        phrases: resolvedPhrases
    });
}

const authKey = <string>process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

const translate = (englishText: string, target: deepl.TargetLanguageCode, options?: deepl.TranslateTextOptions) => new Promise((resolve, reject) => {
    console.log('Translating:', englishText)
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
