import Image from "next/image";
import CompletePhrase from "../atoms/CompletePhrase";

type Params = {
    phraseId: number;
    accent: string;
    gender: string;
    shortDescription: string;
    texts: { [key: string]: string };
}

export default function CardHeader(params: Params) {
    const { phraseId, accent, gender, shortDescription, texts } = params

    return (
        <div className="flex min-h-[73px] items-top gap-4 mt-2 pt-2 px-4">
            <div className='w-[49px]'>
                <Image
                    width={49}
                    height={49}
                    src={`/${gender}.png`}
                    alt={`${shortDescription} | English Flow`}
                    className="w-[49px] h-[49px] rounded-full object-cover mt-[-2px]"
                />
            </div>

            <div className="flex-1">
                <h3 className="text-md leading-5 font-semibold text-white">
                    {shortDescription}
                </h3>

                <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                    {accent === 'american' && (
                        <><i className={`em em-us`} /> <span>{texts.american}</span></>
                    )}

                    {accent === 'british' && (
                        <><i className={`em em-gb`} /> <span>{texts.british}</span></>
                    )}
                </div>
            </div>

            <div className="w-[30px]">
                <CompletePhrase phraseId={phraseId} />
            </div>
        </div>
    )
}

export const texts = {
    american: 'American English',
    british: 'British English',
}