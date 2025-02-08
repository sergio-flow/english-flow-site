import formidable from 'formidable';
import fs from 'fs';
import { createClient } from "@supabase/supabase-js";

const projectID = process.env.SUPABASE_PROJECT_ID;
const anonKey = process.env.SUPABASE_ANON_KEY;

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

        if (!originalFilename.startsWith('FA - ') && !originalFilename.startsWith('FB - ') && !originalFilename.startsWith('MA - ') && !originalFilename.startsWith('MB - ') && !originalFilename.startsWith('FU - ') && !originalFilename.startsWith('MU - ')) {
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
            case 'MU':
                gender = 'male'
                accent = 'australian'
                break;
            case 'FU':
                gender = 'female'
                accent = 'australian'
                break;
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
                gender = 'male'
                accent = 'british'
                break;
            default:
                throw new Error("Could not determine gender and accent for " + originalFilename);
        }

        const { data: insertedData, error: errorInserting } = await supabase
            .from("phrases")
            .insert({
                phrase,
                audio: supaFilename,
                gender,
                accent,
            });

        if (errorInserting) {
            console.log(errorInserting)
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

    return response.status(200).json({
        message: "Audio files uploaded successfully"
    });
}