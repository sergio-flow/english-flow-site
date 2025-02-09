import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from "@supabase/supabase-js";
import redisClient from 'redis';
import * as deepl from 'deepl-node';

const projectID = process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!projectID || !anonKey) {
    throw new Error('Missing environment variables for Supabase');
}

const supabase = createClient(`https://${projectID}.supabase.co`, anonKey);
const redis = await redisClient.createClient({ url: process.env.REDIS_URL }).connect();

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

type QueryParams = {
    languageCode: deepl.TargetLanguageCode;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const { languageCode } = request.query as QueryParams;

    if (!languageCode) {
        return response.status(400).json({ error: 'Missing language code' });
    }

    // const redisKey = `all-speak-like-x-${languageCode}-1`;

    // const value = await redis.get(redisKey);

    // if (value) {
    //     console.log("Returning from Redis");

    //     return response.status(200).json(JSON.parse(value));
    // } else {
    //     console.log("Not returning from Redis");
    // }

    let supabaseQuery = supabase
        .from('speak_like_x')
        .select('*')
    const { data, error } = await supabaseQuery;

    if (!data) {
        return response.status(404).json({ error: 'Not found' });
    }

    const slugs = data.map((d: any) => d.slug)

    const translations: any = await supabase.from('speak_like_translations')
        .select('*')
        .in('slug', slugs)
        .eq('language_code', languageCode)

    const arrayToReturn = []

    for (const d of translations.data) {
        const { title, slug, tags_json, content_json } = d;

        const obj = data.find((d: any) => d.slug === slug);

        if (obj) {
            const newObj = {
                image: obj.image,
                slug: obj.slug,
                title: title,
                tagsJson: tags_json,
                contentJson: content_json
            }

            arrayToReturn.push(newObj)
        }
    }

    // await redis.set(redisKey, JSON.stringify(newObj), {
    //     EX: 60 * 60 * 0.5 // 24 hours
    // });

    return response.status(200).json(arrayToReturn)
}

const authKey = <string>process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

type TranslateObject = {
    text: string;
    mainKey: string;
    subKey?: string;
    mainType?: string;
    context?: string;
    originalText?: string;
}

const translate = (object: TranslateObject, target: deepl.TargetLanguageCode) => new Promise((resolve, reject) => {
    console.log('Translating:', object.text);
    let options: deepl.TranslateTextOptions = {}
    if (object.context) {
        options.context = object.context
    }
    translator.translateText(object.text, "en", target, options)
        .then(({ text }) => {
            resolve({
                ...object,
                text
            });
        })
        .catch((err) => {
            reject(err);
        });
});

const whatToTranslate = (dataArray: any[]) => {
    const arrayKeyTranslations = []

    for (const mainKey in dataArray) {
        const { translate, paragraph, headline } = dataArray[mainKey]

        if (paragraph && Array.isArray(paragraph)) {
            for (const subKey in paragraph) {
                const { translate, text } = paragraph[subKey]

                if (translate && typeof text === 'string') {
                    arrayKeyTranslations.push({
                        mainKey: mainKey,
                        subKey: subKey,
                        mainType: 'paragraph',
                        text,
                        context: paragraph.map(p => p.text).join(" ")
                    })
                }
            }
        }

        if (translate && paragraph && typeof paragraph === 'string') {
            arrayKeyTranslations.push({
                mainKey,
                mainType: 'paragraph',
                text: paragraph
            })
        }

        if (translate && headline && typeof headline === 'string') {
            arrayKeyTranslations.push({
                mainKey,
                mainType: 'headline',
                text: paragraph
            })
        }
    }

    return arrayKeyTranslations
}

const fillInTranslations = (dataArray: any[], translations: any[]) => {
    const filledArray = []

    for (const mainKey in dataArray) {
        const { translate, paragraph, headline } = dataArray[mainKey]

        if (paragraph && Array.isArray(paragraph)) {
            const filledParagraph = []

            for (const subKey in paragraph) {
                const { translate, text } = paragraph[subKey]
                const translation = translations.find((t: any) => t.mainKey === mainKey && t.subKey === subKey)

                if (translation) {
                    filledParagraph.push({
                        text: translation.text
                    })
                } else {
                    filledParagraph.push({
                        text
                    })
                }

            }

            filledArray.push({
                paragraph: filledParagraph
            })
        } else if (translate && paragraph && typeof paragraph === 'string') {
            const translation = translations.find((t: any) => t.mainKey === mainKey)

            if (translation) {
                filledArray.push({
                    paragraph: translation.text
                })
            } else {
                filledArray.push({
                    paragraph
                })
            }
        } else if (translate && headline && typeof headline === 'string') {
            const translation = translations.find((t: any) => t.mainKey === mainKey)

            if (translation) {
                filledArray.push({
                    headline: translation.text
                })
            } else {
                filledArray.push({
                    headline
                })
            }
        } else {
            filledArray.push(dataArray[mainKey])
        }
    }

    return filledArray
}


const example = [
    {
        "translate": true,
        "paragraph": "Hey there! 👋 If you’re into learning English with a touch of that lovely Australian accent, you’re in the right place! We’ve got something super cool to share with you, featuring Bianca Censori—an architect and model with a charming Australian accent. 🇦🇺✨"
    },
    {
        "translate": true,
        "paragraph": "In this article, we’ve picked out 9 phrases from Bianca that are pure gold for anyone looking to sound more natural and confident in English. Whether you’re prepping for an interview, brainstorming at work, or just want to spice up your conversations, these phrases are your new best friends!"
    },
    {
        "translate": true,
        "paragraph": "What makes these phrases special? Well, they’re perfect for when you want to talk about yourself or share your thoughts in a way that sounds thoughtful and polished. Plus, they’re super versatile—you can drop them into all kinds of situations. Some are great for starting or switching topics, while others help you wrap things up nicely."
    },
    {
        "translate": true,
        "paragraph": "And let’s be honest, if you’re a fan of that Aussie vibe and rhythm, you’ll love practicing these! So, whether you’re aiming to ace your next interview or just want to chat like a pro, Bianca’s phrases are here to help you shine. 💪"
    },
    {
        "translate": true,
        "paragraph": "So, ready to dive in and start sounding like a native? Let’s get started!"
    },
    {
        "headline": "What does that look like, what does that feel like?"
    },
    {
        "showPhrase": 47
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In a team meeting discussing a new marketing strategy, a colleague might ask,"
            },
            {
                "text": "“What does that look like, what does that feel like?”"
            },
            {
                "translate": true,
                "text": "to get a clearer picture of the proposed plan."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: When planning a vacation, a friend might inquire,"
            },
            {
                "text": "“What does that look like, what does that feel like?”"
            },
            {
                "translate": true,
                "text": "to understand the experience of traveling to a new country."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "headline": "To the familiar idea, of the human need, to be sheltered."
    },
    {
        "showPhrase": 46
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In a philosophy class discussing basic human needs, a student might reference this phrase to highlight the importance of shelter."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: When volunteering at a homeless shelter, someone might say,"
            },
            {
                "text": "“To the familiar idea, of the human need, to be sheltered,”"
            },
            {
                "translate": true,
                "text": "to emphasize why their work is crucial."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "headline": "Idealistically, it would be."
    },
    {
        "showPhrase": 41
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In a brainstorming session at work, an employee might express,"
            },
            {
                "text": "“Idealistically, it would be to launch the product globally”"
            },
            {
                "translate": true,
                "text": "sharing their vision."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: When discussing personal goals, someone might say,"
            },
            {
                "text": "“Idealistically, it would be to travel the world”"
            },
            {
                "translate": true,
                "text": "sharing their aspirations."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "translate": false,
        "headline": "My passion for architecture lies in fabrication."
    },
    {
        "showPhrase": 42
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In a career counseling session, a student might say,"
            },
            {
                "text": "“My passion for engineering lies in problem-solving”"
            },
            {
                "translate": true,
                "text": "to specify their interest area."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: At a networking event, an architect might say,"
            },
            {
                "text": "“My passion for architecture lies in sustainable design”"
            },
            {
                "translate": true,
                "text": "to describe their focus."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "headline": "Specifically for me, I’d love to see."
    },
    {
        "showPhrase": 43
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In a feedback session at work, an employee might say,"
            },
            {
                "text": "“Specifically for me, I’d love to see more opportunities for professional development.”"
            },
            {
                "translate": true,
                "text": "expressing their desire."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: When discussing community improvements, a resident might say,"
            },
            {
                "text": "Specifically for me, I’d love to see better public transportation”"
            },
            {
                "translate": true,
                "text": "sharing their wish."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "headline": "That’s really, just kinda, how my brain works."
    },
    {
        "showPhrase": 44
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In an informal chat with friends about decision-making styles, someone might explain,"
            },
            {
                "text": "“That’s really, just kinda, how my brain works”"
            },
            {
                "translate": true,
                "text": "to describe their methodical approach."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: When talking about problem-solving techniques, a colleague might say,"
            },
            {
                "text": "“That’s really, just kinda, how my brain works”"
            },
            {
                "translate": true,
                "text": "to describe their natural tendencies."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "headline": "To elaborate, on what I was saying."
    },
    {
        "showPhrase": 45
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In a lecture, a professor might say,"
            },
            {
                "text": "“To elaborate, on what I was saying”"
            },
            {
                "translate": true,
                "text": "before providing more details on a complex topic."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: In a meeting, after a brief explanation, a team member might say,"
            },
            {
                "text": "“To elaborate, on what I was saying”"
            },
            {
                "translate": true,
                "text": "to add more context."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "headline": "For what, it really means."
    },
    {
        "showPhrase": 39
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: Someone might say,"
            },
            {
                "translate": false,
                "text": "“For what, it really means”"
            },
            {
                "translate": true,
                "text": "to emphasise transparency, and authenticity, and it’s also a common way to end your side of the conversation."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "translate": false,
        "headline": "I think we can learn a lot, from conceptualising, some of these projects."
    },
    {
        "showPhrase": 40
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 1: In a team retrospective, a member might reflect,"
            },
            {
                "text": "“I think we can learn a lot, from conceptualising, some of these projects”"
            },
            {
                "translate": true,
                "text": "looking back on past work."
            }
        ]
    },
    {
        "paragraph": [
            {
                "translate": true,
                "text": "Example 2: When planning a community event, a volunteer might say,"
            },
            {
                "text": "“I think we can learn a lot, from conceptualising, some of these projects”"
            },
            {
                "translate": true,
                "text": "emphasizing the value of the planning process."
            }
        ]
    },
    {
        "showDivider": true
    },
    {
        "translate": true,
        "paragraph": "And there you have it! 9 phrases from Bianca that are sure to level up your English game. 🚀💬"
    }
]