import OpenAI from "openai";
import * as deepl from 'deepl-node';
import redisClient from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const redis = await redisClient.createClient({ url: process.env.REDIS_URL }).connect();

import { createClient } from "@supabase/supabase-js";

const projectID = process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!projectID || !anonKey) {
    throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(`https://${projectID}.supabase.co`, anonKey);

type Variables = {
    phraseId: string | number;
    phraseText: string;
    wordGroups: string[];
    // countryCode: string;
    languageCode: string;
}

const authKey = <string>process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

const translate = (englishText: string, target: deepl.TargetLanguageCode, options?: deepl.TranslateTextOptions) => new Promise((resolve, reject) => {
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

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { phraseId, languageCode } = request.body as Variables;

    if (
        !phraseId ||
        !languageCode
    ) {
        throw new Error('Missing required parameters');
    }

    const value = await redis.get(`${languageCode}-${phraseId}`);

    if (value) {
        console.log("Returning from Redis");

        return response.status(200).json({
            studyMaterial: value
        });
    }

    let markdown = null

    const phrase: any = await supabase
        .from('phrases')
        .select('*')
        .eq('id', phraseId)
        .single();

    const {
        // short_description: shortDescription,
        phrase: phraseText,
        word_groups: wordGroups
    } = phrase.data;

    // const wordsFromGroups = wordGroups.map((group: string) => group.split(" ")).flat();

    const texts = [
        // shortDescription,
        ...wordGroups,
        phraseText,
        // ...wordsFromGroups
    ]

    const translatedLines: any = await supabase
        .from('translated_lines')
        .select('*')
        // .eq('target_country_code', countryCode.toUpperCase())
        .eq('target_language_code', languageCode.toLowerCase())
        .not('translated_text', 'is', null)
        .not('english_text', 'is', null)
        .in('english_text', texts);

    // const language: any = await supabase
    //     .from('languages_supported')
    //     .select('*')
    //     .eq('country_code', countryCode.toUpperCase())
    //     .eq('language_code', languageCode.toLowerCase())
    //     .single();

    // const { language_english_name: translateTo } = language.data;

    const existingSet = new Set(translatedLines.data.map((line: any) => line.english_text));

    const hasPhraseText = existingSet.has(phraseText);
    const hasWordGroups = wordGroups.every((group: string) => existingSet.has(group));

    const promises = [];

    const lang = languageCode.toLowerCase() as deepl.TargetLanguageCode;

    if (!hasPhraseText) {
        promises.push(translate(phraseText, lang))
    }

    if (!hasWordGroups) {
        for (const group of wordGroups) {
            promises.push(translate(group, lang, { context: phraseText }));
        }
    }

    if (promises.length === 0) {
        console.log("Returning from DB");

        return response.status(200).json({
            studyMaterial: generateMarkdown({
                phraseText,
                wordGroups,
                translations: translatedLines.data.map((line: any) => ({
                    englishText: line.english_text,
                    translatedText: line.translated_text
                }))
            })
        });
    }

    console.log("Returning from OpenAI");

    const translations = await Promise.all(promises);

    const insertTranslations = translations.map((translation: any) => {
        return {
            // target_country_code: countryCode.toUpperCase(),
            target_language_code: languageCode.toLowerCase(),
            english_text: translation.english_text,
            translated_text: translation.translated_text
        }
    });

    const { data: insertedTranslations, error } = await supabase
        .from('translated_lines')
        .insert(insertTranslations)
        .select('*');

    const combinedTranslations = [
        ...translatedLines.data,
        ...insertedTranslations || [],
    ];

    const studyMaterial = generateMarkdown({
        phraseText,
        wordGroups,
        translations: combinedTranslations.map((line: any) => ({
            englishText: line.english_text,
            translatedText: line.translated_text
        }))
    })

    await redis.set(`${languageCode}-${phraseId}`, studyMaterial, {
        EX: 60 * 60 * 0.5 // 24 hours
    });

    return response.status(200).json({
        studyMaterial
    });
}

type MarkdownVars = {
    phraseText: string;
    wordGroups: string[];
    translations: { englishText: string, translatedText: string }[];
}

const generateMarkdown = (vars: MarkdownVars) => {
    const sentenceTranslation = (sentence: string) => vars.translations.find(({ englishText }) => englishText === sentence)?.translatedText

    const wordGroupsToMarkdown = (wordGroups: string[]) => {
        const wordGroupTranslation = (wordGroup: string) => vars.translations.find(({ englishText }) => englishText === wordGroup)?.translatedText

        return wordGroups.map((group, index) => {
            // const words = group.split(" ");

            // const wordDescription = (word: string) => vars.translations.find(({ englishText, type }) => englishText === word && type === 'word_description')?.translatedText
            // const wordExamples = (word: string) => vars.translations.find(({ englishText, type }) => englishText === word && type === 'word')?.translatedText

            // const wordEntries = words.map(word => `- **${word}**: ${wordDescription(word)}. (${wordExamples(word)})`).join("\n");

            return `- **${group}** «${wordGroupTranslation(group)}»`;
        }).join("\n");
    }

    return `${wordGroupsToMarkdown(vars.wordGroups)}

---

**${vars.phraseText}** «${sentenceTranslation(vars.phraseText)}»
`;
}

const trimSpacesAndDots = (str: string) => {
    return str.replace(/^[.\s]+|[.\s]+$/g, '');
}

const generateWordTranslationPrompt = (word: string, language: string, wholeSentence?: string) => `
Provide a 1-2 translation examples of the word "${word}" for speakers of the ${language} language. 
Return the response in ${language}. 
Don't include any English in the response. 
The whole response should be 1-2 words maximum. 
Return in one line.
Don't include the word "${word}" in the response, only the translations.
If more words are returned, add a comma in between.
Don't wrap up the response in any symbols, or quotes.
`

const generateWordDescriptionTranslation = (word: string, language: string, wholeSentence?: string) => `
Provide a 1-2 word grammar description of the word "${word}",
such as "Adjective, Verb" using this context "${wholeSentence}",
but in ${language}. If it's a verb, mention the tense, past, present or future.
Return the response in ${language}. 
Don't include any English in the response. 
Don't wrap up the response in any symbols, or quotes.
`

const generateWordGroupTranslation = (wordGroup: string, language: string, wholeSentence?: string) => `
Translate this part of the sentence "${wordGroup}" to ${language}.
Return the response in ${language}.
Don't include any English in the response. 
Don't wrap up the response in any symbols, or quotes.
`

const generateSentenceTranslation = (sentence: string, language: string) => `
Translate this sentence "${sentence}" to ${language}.
Return the response in ${language}. 
Don't include any English in the response. 
Don't wrap up the response in any symbols, or quotes.
`

type TextType = "sentence" | "word" | "word_group" | "word_description";

const callOpenAI = async (prompt: string, text: string, type: TextType) => {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { "role": "user", "content": prompt }
        ]
    });

    const { content } = completion.choices[0].message;

    return {
        type,
        english_text: text,
        translated_text: ['word_group', 'word_description', 'word'].includes(type) ? trimSpacesAndDots(String(content)) : content
    }
}