import Image from "next/image";
import { translateIcon } from "../atoms/Icons";

type Params = {
    accent: string;
    gender: "male" | "female";
    shortDescription: string;
}

export default function CardHeader(params: Params) {
    const { accent, gender, shortDescription } = params

    return (
        <div className="flex items-center gap-4 mt-2 mb-2 pt-2 px-4">
            <div className='w-[49px]'>
                <Image
                    width={49}
                    height={49}
                    src={`/${gender}.png`}
                    alt={`${shortDescription} | English Flow`}
                    className="w-[49px] h-[49px] rounded-full object-cover"
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white">
                    {shortDescription}
                </h3>

                <div className="text-sm text-gray-400 flex items-center gap-2">
                    {accent === 'american' && (
                        <><i className={`em em-us`} /> <span>American English</span></>
                    )}

                    {accent === 'british' && (
                        <><i className={`em em-gb`} /> <span>British English</span></>
                    )}
                </div>
            </div>

            {/* {languageCode !== 'en' && (
                <button onClick={() => setExpandTranslations(p => !p)} className={`text-xs ${expandTranslations ? 'bg-sky-200' : 'hover:bg-white/10'} p-2 rounded-lg ml-auto mr-2 font-semibold uppercase text-gray-600 hover:text-orange-500`}>
                    {translateIcon(34, 34, expandTranslations ? "fill-black" : "fill-sky-200")}
                </button>
            )} */}
        </div>
    )
}