import Link from "next/link"

type Params = {
    countryCode: string;
    languageCode: string;
    availableLanguages: { [key: string]: string };
    texts: { [key: string]: string };
}

export default function Hero(params: Params) {
    const { countryCode, languageCode, availableLanguages, texts } = params

    return (
        <div className="w-[1340px] mx-auto px-4 py-6 gap-10 mb-6">
            <div className="country-language flex items-center gap-4 mb-10">
                <Link href={`/${countryCode}`} className="flex cursor-pointer items-center gap-2 p-1 px-2 pr-3 rounded-lg bg-white/10">
                    <span className="em em-flag-md" />
                    <span className="text-white font-semibold text-xs">Moldova</span>
                </Link>
                <span className="text-white text-lg">→</span>
                <div className="flex items-center rounded-lg bg-white/10">
                    {Object.keys(availableLanguages).map((key, index) => (
                        <Link key={key} href={`/${countryCode}/${key}`} className={`${index === 0 ? "rounded-l-lg" : ""} ${index === Object.keys(availableLanguages).length - 1 ? "rounded-r-lg" : ""} cursor-pointer text-white py-1 px-2 font-semibold text-xs ${key === languageCode ? 'bg-orange-400' : ''}`}>{availableLanguages[key]}</Link>
                    ))}
                </div>
            </div>

            <h1 className="text-4xl font-semibold text-white mb-3 mt-4">{texts.title}</h1>
            <h2 className="text-xl leading-8 text-white/40">
                {texts.description1}
                <br />
                {texts.description2}
                {/* By following a 3-step process:
                <br />
                <span className="bg-[#69d6e1] w-[28px] inline-block font-bold text-center rounded-4xl align-top text-white text-lg mt-[3px] mr-[10px]">1</span>
                Listen →
                <span className="bg-[#69d6e1] w-[28px] inline-block font-bold text-center rounded-4xl align-top text-white text-lg mt-[3px] mr-[2px] ml-[10px] mr-[10px]">2</span>
                Record →
                <span className="bg-[#69d6e1] w-[28px] inline-block font-bold text-center rounded-4xl align-top text-white text-lg mt-[3px] mr-[2px] ml-[10px]">3</span> Compare */}
            </h2>
        </div>
    )
}

export const texts = {
    title: 'Database of English phrases',
    description1: '1. Understand English by studying phrases individually.',
    description2: '2. Improve your speaking skills by recording your voice.',
}