import FirstVisit from "@/_components/molecules/FirstVisit";
import fetchLanguages from "@/_utils/fetchLanguages";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "English Flow",
    description: "Understand English by studying phrases individually.",
    openGraph: {
      title: "English Flow",
      description: "Understand English by studying phrases individually.",
      type: 'website',
      locale: "en",
      siteName: 'English Flow',
      url: `https://www.englishflow.ai`,
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

export default async function Home() {
  const { continents, languages } = await fetchLanguages();

  return (
    <div className="w-md mx-auto py-10">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
        <Image
          width={56}
          height={56}
          alt="English Flow"
          src="/logo.png"
          className="mx-auto h-14 w-auto"
        />
      </div>

      {continents.map((continent) => (
        <div className="py-4" key={continent.continentName}>
          <h1 className="text-white text-xl font-semibold text-center mb-2">{continent.continentName}</h1>
          <div className="grid grid-cols-2 gap-4 py-4">
            {continent.countries.map((country) => {
              const countryCode = country.countryCode.toLowerCase()
              const languageCode = country.languages[0].languageCode.toLowerCase()

              return (
                <Link
                  href={`/${countryCode}/${languageCode}`}
                  key={`${country.countryCode}-${languageCode}`}
                  className="flex cursor-pointer items-center justify-center gap-2 py-3 px-2 rounded-lg hover:bg-white/15 bg-white/10"
                >
                  <span className={`em em-${countryCode === 'id' ? 'indonesia' : countryCode} em-flag-${countryCode}`} />
                  <span className="text-white font-semibold text-sm">{country.countryName}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )
      )}

      <FirstVisit languages={languages} />
    </div>
  );
}
