import formidable from 'formidable';
import fs from 'fs';
import { createClient } from "@supabase/supabase-js";

const projectID = process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUPABASE_ANON_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(`https://${projectID}.supabase.co`, anonKey);

export const config = {
    api: {
        bodyParser: false,
    },
};
export default async function handler(request, response) {
    const form = formidable({ multiples: false }); // Allow single file uploads

    const [fields, files] = await form.parse(request);
    const { audioFiles } = files;

    for (const file of audioFiles) {
        const { originalFilename } = file;

        if (!originalFilename.endsWith('.mp3')) {
            return response.status(400).json({ error: 'File must be an mp3' });
        }

        if (!originalFilename.startsWith('FA - ') && !originalFilename.startsWith('FB - ') && !originalFilename.startsWith('MA - ') && !originalFilename.startsWith('MB - ')) {
            return response.status(400).json({ error: 'File must start with FA, FB, MA, or MB.' });
        }
    }

    for (const file of audioFiles) {
        const fileBody = fs.readFileSync(file.filepath);

        const { originalFilename, newFilename } = file;
        const genderAndAccent = originalFilename.substring(0, 2);

        const phrase = originalFilename.substring(5, originalFilename.length - 4);

        const supaFilename = `${newFilename}.mp3`;

        let gender, accent;

        switch (genderAndAccent) {
            case 'FA':
                gender = 'female'
                accent = 'american'
                break;
            case 'FB':
                gender = 'female'
                accent = ' british'
                break;
            case 'MA':
                gender = 'male'
                accent = 'american'
                break;
            case 'MB':
                gender = ' male'
                accent = 'british'
                break;
            default:
                throw new Error("Could not determine gender and accent for " + originalFilename);
        }

        const promises = [
            getConversationCategory(phrase),
            getShortDescription(phrase)
        ]
        const [conversationCategory, shortDescription] = await Promise.all(promises);

        const translationPromises = [
            getWordTranslations(phrase, 'Chinese'),
            getWordTranslations(phrase, 'Hindi'),
            getWordTranslations(phrase, 'Spanish'),
            getWordTranslations(phrase, 'Portuguese'),
            getWordTranslations(phrase, 'Turkish'),
            getWordTranslations(phrase, 'Russian'),
            getWordTranslations(phrase, 'Indonesian'),
            getWordTranslations(phrase, 'Persian'),
            getWordTranslations(phrase, 'Romanian'),
            getWordTranslations(phrase, 'French')
        ]
        const [chinese, hindi, spanish, portuguese, turkish, russian, indonesian, persian, romanian, french] = await Promise.all(translationPromises);
        const wordTranslations = {
            zh: JSON.parse(chinese),
            hi: JSON.parse(hindi),
            es: JSON.parse(spanish),
            pt: JSON.parse(portuguese),
            tr: JSON.parse(turkish),
            ru: JSON.parse(russian),
            id: JSON.parse(indonesian),
            fa: JSON.parse(persian),
            ro: JSON.parse(romanian),
            fr: JSON.parse(french)
        }

        const { data: insertedData, error: errorInserting } = await supabase
            .from("phrases")
            .insert({
                phrase,
                audio: supaFilename,
                gender,
                accent,
                short_description: shortDescription,
                conversation_type: conversationCategory,
                word_translations: transformObject(JSON.parse(breakSentenceIntoWords(phrase)), wordTranslations)
            });

        if (errorInserting) {
            throw new Error("Error inserting data for " + supaFilename);
        }

        console.log('Data inserted successfully:', insertedData);

        const { data: uploadedData, error: uploadedError } = await supabase
            .storage
            .from('audio')
            .upload(supaFilename, fileBody, { // Upload the file to the audio folder
                cacheControl: '3600', // 1 hour
                upsert: false, // Do not overwrite if the file already exists
                contentType: 'audio/mpeg', // Specify the content type
            });

        if (uploadedError) {
            console.error('Error uploading file:', uploadedError);
            return response.status(500).json({ error: 'File upload failed' });
        }

        console.log('File uploaded successfully:', uploadedData);
    }

    // form.parse(request, async (err, fields, files) => {
    //     if (err) {
    //         console.error('Error parsing the form:', err);
    //         return response.status(500).json({ error: 'File upload failed' });
    //     }

    //     const audioFiles = files.audioFiles; // Access the uploaded file

    //     console.log('Audio files:', audioFiles);

    //     for (const file of audioFiles) {
    //         console.log('File:', file);

    //         const fileBody = fs.readFileSync(file.filepath);

    //         const { data, error } = await supabase
    //             .storage
    //             .from('audio')
    //             .upload(file.originalFilename, file, { // Upload the file to the audio folder
    //                 cacheControl: '3600', // 1 hour
    //                 upsert: false, // Do not overwrite if the file already exists
    //                 contentType: 'audio/mpeg', // Specify the content type
    //             });

    //         console.log('Data:', data);

    //         if (error) {
    //             console.error('Error uploading file:', error);
    //             return response.status(500).json({ error: 'File upload failed' });
    //         }

    //         console.log('Data:', data);
    //     }

    //     // Example: Save the file to cloud storage (e.g., AWS S3)
    //     // You can also save to local tmp folder if necessary
    //     // const data = fs.readFileSync(file.filepath);

    //     response.status(200).json({ success: true, file });
    // });

    return response.status(200).json({
        message: "Audio files uploaded successfully"
    });


    const file = request.body;

    const { data, error } = await supabase
        .storage
        .from('audio')
        .list("unprocessed", {
            limit: 100, // Adjust the limit if needed
            offset: 0,
            sortBy: { column: 'name', order: 'asc' } // Sort by name
        });

    if (error) {
        throw new Error("Error fetching files and folders from unprocessed folder");
    }

    // console.log(data)

    // Display the retrieved files and folders
    for (const item of data) {
        // first 2 letters
        const genderAndAccent = item.name.substring(0, 2);

        let gender, accent;

        switch (genderAndAccent) {
            case 'FA':
                gender = 'female'
                accent = 'american'
                break;
            case 'FB':
                gender = 'female'
                accent = ' british'
                break;
            case 'MA':
                gender = 'male'
                accent = 'american'
                break;
            case 'MB':
                gender = ' male'
                accent = 'british'
                break;
            default:
                throw new Error("Could not determine gender and accent for " + item.name);
        }

        const phrase = item.name.substring(5, item.name.length - 4);

        const slug = slugify(phrase);

        const { data: insertedData, error: errorInserting } = await supabase
            .from("phrases")
            .insert({
                phrase,
                audio: slug,
                gender,
                accent
            });

        if (errorInserting) {
            throw new Error("Error inserting data for " + item.name);
        }

        console.log('Data inserted successfully:', insertedData);

        const { data, error: errorMoving } = await supabase
            .storage
            .from('audio')
            .move(`unprocessed/${item.name}`, `processed/${slug}.mp3`);

        if (errorMoving) {
            throw new Error("Error moving file " + item.name + " to processed folder");
        }

        console.log('Data moved successfully:', data);
    };

    return response.status(200).json({
        ok: true
    });
}


const getWordTranslations = (phrase, language) => {
    const wordsJson = breakSentenceIntoWords(phrase);

    const prompt = `
${wordsJson}

---

For each word, add the translation in ${language} while also keeping the full context of the sentence --${phrase}--.
Return only the json object. Return the minified version of the json. Return it in one line. Don't wrap it up into \`\`\`json and \`\`\`.
`;

    return callChatGPT(prompt);
}

const getConversationCategory = (phrase) => {
    const prompt = `
Starting a Conversation
Keeping a Conversation Going
Getting Deeper in a Conversation
Changing the Topic
Jumping In
Clearing Things Up
Disagreeing Respectfully
Agreeing and Supporting
Ending a Conversation

---

Categorise the following phrase: "${phrase}" into one of the categories above.
Return only the category.
`;

    return callChatGPT(prompt);
}

const getShortDescription = (phrase) => {
    const prompt = `
"What should I pick? What should I pick?"
Seeking guidance

"Oh my God, you guys are so sweet"
Giving compliment

"Look at you"
Acknowledging admiration

"Are they just gonna like come run in here?"
Expressing anticipation

"I was nervous, I was excited"
Sharing emotions

"Hey, how’d that happen?"
Expressing surprise

"I mean, what can I say?"
Showing humility

"So, um, I’m terrified"
Admitting fear

"I love him"
Declaring affection

"You go up, right?"
Seeking confirmation

"Oh, really?"
Showing interest

---

Describe the following phrase: "${phrase}" in 2-3 words using the sample examples above.
Return only the 2-3 words.
`;

    return callChatGPT(prompt);
}

async function callChatGPT(prompt) {
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
    };

    const data = {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        const json = await response.json();
        const result = json.choices[0].message.content;
        return result;
    } catch (error) {
        console.error(
            "Error calling ChatGPT API:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}


const slugify = (text) => {
    return text
        .toString()                   // Cast to string (optional)
        .normalize('NFKD')            // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase()                // Convert the string to lowercase letters
        .trim()                       // Remove whitespace from both sides of a string (optional)
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
        .replace(/\_/g, '-')           // Replace _ with -
        .replace(/\-\-+/g, '-')       // Replace multiple - with single -
        .replace(/\-$/g, '');         // Remove trailing -
}

function breakSentenceIntoWords(sentence) {
    const words = sentence.match(/\b\w+\b/g);
    const wordDict = {};

    words.forEach(word => {
        wordDict[word] = "";
    });

    return JSON.stringify(wordDict);
}

function transformObject(baseObject, translations) {
    const result = {};

    // Iterate over each key in the base object
    for (const key in baseObject) {
        result[key] = {};

        // For each language in the translations object
        for (const lang in translations) {
            // Add the translated value for the current key
            result[key][lang] = translations[lang][key] || "";
        }
    }

    return Object.entries(result);
}