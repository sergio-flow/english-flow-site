import FilterPhrases from "@/_components/templates/FilterPhrases";
import Hero from "@/_components/templates/Hero";
import Navbar from "@/_components/templates/Navbar";
import fetchPhrases from "@/_utils/fetchPhrases";
import allTexts from "@/_utils/allTexts";
import resolveTranslations from "@/_utils/resolveTranslations";
import fetchLanguages from "@/_utils/fetchLanguages";

type Data = {
  params: Promise<{
    countryCode: string;
    languageCode: string;
  }>,
  searchParams: Promise<{
    [key: string]: string;
  }>
};

export default async function Home(data: Data) {
  const { countryCode, languageCode } = await data.params;
  const { gender, accent, conversation } = await data.searchParams

  const phrases = await fetchPhrases({ countryCode, languageCode, gender, accent, conversation });
  const { languages } = await fetchLanguages();
  const { navbarTexts, heroTexts, filterPhrasesTexts } = await resolveTranslations({ allTexts, languageCode, countryCode });

  const availableLanguages = languages
    .filter(language => language.countryCode.toLowerCase() === countryCode.toLowerCase())
    .reduce((acc: { [key: string]: string }, language) => {
      acc[language.languageCode] = language.languageLocalName;
      return acc;
    }, {});

  return (
    <>
      <Navbar texts={navbarTexts} />
      <Hero
        texts={heroTexts}
        countryCode={countryCode}
        languageCode={languageCode}
        availableLanguages={availableLanguages}
      />
      <FilterPhrases
        countryCode={countryCode}
        languageCode={languageCode}
        texts={filterPhrasesTexts}
        phrases={phrases}
        searchParams={{ gender, accent, conversation }}
      />
    </>
  );
}
