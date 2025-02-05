import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
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
    countryCode: string;
    languageCode: string;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { phraseId, countryCode, languageCode } = request.body as Variables;

    if (
        !phraseId ||
        !countryCode ||
        !languageCode
    ) {
        throw new Error('Missing required parameters');
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

    const wordsFromGroups = wordGroups.map((group: string) => group.split(" ")).flat();

    const texts = [
        // shortDescription,
        ...wordGroups,
        phraseText,
        ...wordsFromGroups
    ]

    const translatedLines: any = await supabase
        .from('translated_lines')
        .select('*')
        .eq('target_country_code', countryCode.toUpperCase())
        .eq('target_language_code', languageCode.toLowerCase())
        .not('translated_text', 'is', null)
        .not('english_text', 'is', null)
        .in('english_text', texts);

    const language: any = await supabase
        .from('languages_supported')
        .select('*')
        .eq('country_code', countryCode.toUpperCase())
        .eq('language_code', languageCode.toLowerCase())
        .single();

    const { language_english_name: translateTo } = language.data;

    const existingSet = new Set(translatedLines.data.map((line: any) => line.english_text));

    const hasPhraseText = existingSet.has(phraseText);
    const hasWordGroups = wordGroups.every((group: string) => existingSet.has(group));

    const promises = [];

    if (!hasPhraseText) {
        promises.push(
            callOpenAI(
                generateSentenceTranslation(phraseText, translateTo),
                phraseText,
                'sentence'
            )
        );
    }

    if (!hasWordGroups) {
        for (const group of wordGroups) {
            promises.push(
                callOpenAI(
                    generateWordGroupTranslation(group, translateTo, phraseText),
                    group,
                    'word_group'
                )
            );

            const words = group.split(" ");
            for (const word of words) {
                promises.push(
                    callOpenAI(
                        generateWordTranslationPrompt(word, translateTo),
                        word,
                        'word'
                    )
                );

                promises.push(
                    callOpenAI(
                        generateWordDescriptionTranslation(word, translateTo),
                        word,
                        'word_description'
                    )
                );
            }
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
                    translatedText: line.translated_text,
                    type: line.type
                }))
            })
        });
    }

    const translations = await Promise.all(promises);

    const insertTranslations = translations.map((translation: any) => {
        return {
            target_country_code: countryCode.toUpperCase(),
            target_language_code: languageCode.toLowerCase(),
            english_text: translation.english_text,
            translated_text: translation.translated_text,
            type: translation.type
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

    console.log("Returning from OpenAI");

    return response.status(200).json({
        studyMaterial: generateMarkdown({
            phraseText,
            wordGroups,
            translations: combinedTranslations.map((line: any) => ({
                englishText: line.english_text,
                translatedText: line.translated_text,
                type: line.type
            }))
        })
    });
}

type MarkdownVars = {
    phraseText: string;
    wordGroups: string[];
    translations: { englishText: string, translatedText: string, type: TextType }[];
}

const generateMarkdown = (vars: MarkdownVars) => {
    const sentenceTranslation = (sentence: string) => vars.translations.find(({ englishText, type }) => englishText === sentence && type === 'sentence')?.translatedText

    const wordGroupsToMarkdown = (wordGroups: string[]) => {
        const wordGroupTranslation = (wordGroup: string) => vars.translations.find(({ englishText, type }) => englishText === wordGroup && type === 'word_group')?.translatedText

        return wordGroups.map((group, index) => {
            const words = group.split(" ");

            const wordDescription = (word: string) => vars.translations.find(({ englishText, type }) => englishText === word && type === 'word_description')?.translatedText
            const wordExamples = (word: string) => vars.translations.find(({ englishText, type }) => englishText === word && type === 'word')?.translatedText

            const wordEntries = words.map(word => `- **${word}**: ${wordDescription(word)}. (${wordExamples(word)})`).join("\n");

            return `## ${index + 1}. **${group}**:
${wordEntries}

= ${wordGroupTranslation(group)}\n
\n`;
        }).join("\n");
    }

    return `
${wordGroupsToMarkdown(vars.wordGroups)}
---

„${vars.phraseText}“
=
${sentenceTranslation(vars.phraseText)}
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
Return the response in Russian. 
Don't include any English in the response. 
Don't wrap up the response in any symbols, or quotes.
`

const generateWordGroupTranslation = (wordGroup: string, language: string, wholeSentence?: string) => `
Translate this part of the sentence "${wordGroup}" to ${language} using this context "${wholeSentence}".
Return the response in ${language}. 
Return only the translation of the "${wordGroup}", don't include the context in the response.
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