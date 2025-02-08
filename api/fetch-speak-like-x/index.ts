import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from "@supabase/supabase-js";
import redisClient from 'redis';

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

export default async function handler(request: VercelRequest, response: VercelResponse) {

    const redisKey = 'speak-like-x-v1.1';

    const value = await redis.get(redisKey);

    if (value) {
        console.log("Returning from Redis");

        return response.status(200).json({
            articles: JSON.parse(value)
        });
    }

    let supabaseQuery = await supabase
        .from('speak_like_x')
        .select('*')

    if (!supabaseQuery.data) {
        return response.status(404).json({ error: 'Not found' });
    }

    await redis.set(redisKey, JSON.stringify(supabaseQuery.data), {
        EX: 60 * 60 * 0.5 // 24 hours
    });

    return response.status(200).json({
        articles: supabaseQuery.data
    })
}