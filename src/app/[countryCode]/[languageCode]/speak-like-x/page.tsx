import Navbar from "@/_components/templates/Navbar";
import allTexts from "@/_utils/allTexts";
import resolveTranslations from "@/_utils/resolveTranslations";
import { Metadata } from "next";
import fetchAllSpeakLike from "@/_utils/fetchAllSpeakLike";
import SpeakLikeArticles from "@/_components/templates/SpeakLikeArticles";

type Props = {
  params: Promise<{ countryCode: string, languageCode: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const revalidate = 3600

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { countryCode, languageCode } = await params;

  let title = allTexts.heroTexts.title;
  let description = [allTexts.heroTexts.description1, allTexts.heroTexts.description2].join(" ")

  if (countryCode && languageCode) {
    const resolved = await resolveTranslations({ allTexts, languageCode, countryCode });

    title = resolved.heroTexts.title;
    description = [resolved.heroTexts.description1, resolved.heroTexts.description2].join(" ");
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: languageCode,
      siteName: 'English Flow',
      url: `https://www.englishflow.ai/${countryCode}/${languageCode}`,
      images: [
        {
          url: 'https://www.englishflow.ai/cover.jpg',
          width: 795,
          height: 300,
          alt: 'English Flow',
        },
      ],
    },
  }
}

type Data = {
  params: Promise<{
    countryCode: string;
    languageCode: string;
  }>
};

export default async function Home(data: Data) {
  const { countryCode, languageCode } = await data.params;

  const articles = await fetchAllSpeakLike({ languageCode });

  const { navbarTexts } = await resolveTranslations({ allTexts, languageCode, countryCode });

  return (
    <>
      <Navbar
        texts={navbarTexts}
        page="speak-like-x"
        countryCode={countryCode}
        languageCode={languageCode}
      />

      <SpeakLikeArticles
        title={navbarTexts.speakLike}
        countryCode={countryCode}
        languageCode={languageCode}
        articles={articles}
      />
    </>
  );
}
