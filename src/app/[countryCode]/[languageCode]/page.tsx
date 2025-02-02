import FilterPhrases from "@/_components/templates/FilterPhrases";
import Hero from "@/_components/templates/Hero";
import Navbar from "@/_components/templates/Navbar";
import fetchPhrases from "@/_utils/fetchPhrases";

type Data = {
  params: {
    countryCode: string;
    languageCode: string;
  },
  searchParams: any;
};

export default async function Home(data: Data) {
  const { countryCode, languageCode } = await data.params;
  const { gender, accent, conversation } = await data.searchParams
  const phrases = await fetchPhrases();


  return (
    <>
      <Navbar />
      <Hero />
      <FilterPhrases phrases={phrases} searchParams={{ gender, accent, conversation }} />
    </>
  );
}
