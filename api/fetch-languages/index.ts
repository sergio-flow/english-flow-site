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

    const value = await redis.get('languages');

    if (value) {
        console.log("Returning from Redis");

        return response.status(200).json({
            ...JSON.parse(value)
        });
    }

    let supabaseQuery = await supabase
        .from('languages')
        .select('*')

    if (!supabaseQuery.data) {
        return response.status(404).json({ error: 'Not found' });
    }

    const continents: Continent[] = []
    const languages: Language[] = []

    for (const language of supabaseQuery.data) {
        const { continent_name, country_name, country_code, local_name, code } = language

        let continentIndex = continents.findIndex((continent) => continent.continentName === continent_name)

        if (continentIndex === -1) {
            continents.push({
                continentName: continent_name,
                countries: []
            })

            continentIndex = continents.findIndex((continent) => continent.continentName === continent_name)
        }

        const countryIndex = continents[continentIndex].countries.findIndex((country) => country.countryName === country_name)

        const languageObj = {
            countryCode: country_code,
            languageLocalName: local_name,
            languageCode: code
        }

        languages.push(languageObj)

        if (countryIndex == -1) {
            continents[continentIndex].countries.push({
                countryName: country_name,
                countryCode: country_code,
                languages: [languageObj]
            })
        } else {
            continents[continentIndex].countries[countryIndex].languages.push(languageObj)
        }
    }

    const fetched: Fetched = {
        continents,
        languages
    }

    await redis.set('languages', JSON.stringify(fetched), {
        EX: 60 * 60 * 24 // 24 hours
    });

    return response.status(200).json(fetched)
}