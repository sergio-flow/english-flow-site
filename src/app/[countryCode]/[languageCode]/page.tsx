import FilterPhrases from "@/_components/templates/FilterPhrases";
import fetchPhrases from "@/_utils/fetchPhrases";
import Image from "next/image";

export default async function Home() {
  const phrases = await fetchPhrases();

  console.log(phrases)
  return (
    <FilterPhrases />
  );
}
