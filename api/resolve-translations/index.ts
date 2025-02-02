import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from "@supabase/supabase-js";

const projectID = process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!projectID || !anonKey) {
    throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(`https://${projectID}.supabase.co`, anonKey);

type BodyParams = {
    countryCode: string;
    languageCode: string;
    allTexts: any;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { countryCode, languageCode, allTexts } = request.body as BodyParams;

    const textKeys = Object.keys(allTexts);

    const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('target_country_code', countryCode)
        .eq('target_language_code', languageCode)
        .in('name', textKeys)

    return response.status(200).json({ allTexts: data });
}

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
