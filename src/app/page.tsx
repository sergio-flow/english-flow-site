import Navbar from "@/_components/templates/Navbar";
import allTexts from "@/_utils/allTexts";
import fetchLanguages from "@/_utils/fetchLanguages";
import resolveTranslations from "@/_utils/resolveTranslations";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { continents } = await fetchLanguages();

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
            {continent.countries.map((country, index) => {
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
    </div>
  );
}
