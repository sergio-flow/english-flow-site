import Navbar from "@/_components/templates/Navbar";
import resolveTranslations from "@/_utils/resolveTranslations";
import fetchSpeakLikeX from "@/_utils/fetchSpeakLikeX";
import SpeakLikeArticle from "@/_components/templates/SpeakLikeArticle";
import fetchPhrases from "@/_utils/fetchPhrases";
import allTexts from "@/_utils/allTexts";

// type Props = {
//   params: Promise<{ countryCode: string, languageCode: string }>
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>
// }

export const revalidate = 3600

// export async function generateMetadata(
//   { params }: Props,
// ): Promise<Metadata> {
//   const { countryCode, languageCode } = await params;

//   let title = allTexts.heroTexts.title;
//   let description = [allTexts.heroTexts.description1, allTexts.heroTexts.description2].join(" ")

//   if (countryCode && languageCode) {
//     const resolved = await resolveTranslations({ allTexts, languageCode, countryCode });

//     title = resolved.heroTexts.title;
//     description = [resolved.heroTexts.description1, resolved.heroTexts.description2].join(" ");
//   }

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       type: 'website',
//       locale: languageCode,
//       siteName: 'English Flow',
//       url: `https://www.englishflow.ai/${countryCode}/${languageCode}`,
//       images: [
//         {
//           url: 'https://www.englishflow.ai/cover.jpg',
//           width: 795,
//           height: 300,
//           alt: 'English Flow',
//         },
//       ],
//     },
//   }
// }

type Data = {
  params: Promise<{
    countryCode: string;
    languageCode: string;
    slug: string;
  }>
};

export default async function Home(data: Data) {
  const { countryCode, languageCode, slug } = await data.params;

  const article = await fetchSpeakLikeX({
    languageCode,
    slug
  });

  console.log(article)

  const phraseIds = (Array.isArray(article) ? article[0].contentJson : article.contentJson)
    .map((content) => content.showPhrase)
    .filter((val) => typeof val === "string" || typeof val === "number");

  const phrases = await fetchPhrases({ countryCode, languageCode, phraseIds });

  const { navbarTexts, filterPhrasesTexts } = await resolveTranslations({ allTexts, languageCode, countryCode });


  return (
    <>
      <Navbar
        texts={navbarTexts}
        page="speak-like-x"
        countryCode={countryCode}
        languageCode={languageCode}
      />

      <SpeakLikeArticle
        countryCode={countryCode}
        languageCode={languageCode}
        article={Array.isArray(article) ? article[0] : article}
        phrases={phrases}
        texts={filterPhrasesTexts}
      />
    </>
  );
}
