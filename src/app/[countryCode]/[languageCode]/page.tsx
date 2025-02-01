import FilterPhrases from "@/_components/templates/FilterPhrases";
import Hero from "@/_components/templates/Hero";
import Navbar from "@/_components/templates/Navbar";
import fetchPhrases from "@/_utils/fetchPhrases";

export default async function Home() {
  const phrases = await fetchPhrases();

  return (
    <>
      <Navbar />
      <Hero />
      <FilterPhrases phrases={phrases} />
    </>
  );
}
