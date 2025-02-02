import Image from "next/image";
import { checkIcon, translateIcon } from "../atoms/Icons";
import CompletePhrase from "../atoms/CompletePhrase";

type Params = {
    phraseId: string;
    accent: string;
    gender: "male" | "female";
    shortDescription: string;
}

export default function CardHeader(params: Params) {
    const { phraseId, accent, gender, shortDescription } = params

    return (
        <div className="flex items-top gap-4 mt-2 mb-1 pt-2 px-4">
            <div className='w-[49px]'>
                <Image
                    width={49}
                    height={49}
                    src={`/${gender}.png`}
                    alt={`${shortDescription} | English Flow`}
                    className="w-[49px] h-[49px] rounded-full object-cover"
                />
            </div>

            <div className="flex-1">
                <h3 className="text-md leading-5 font-semibold text-white">
                    {shortDescription}
                </h3>

                <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                    {accent === 'american' && (
                        <><i className={`em em-us`} /> <span>American English</span></>
                    )}

                    {accent === 'british' && (
                        <><i className={`em em-gb`} /> <span>British English</span></>
                    )}
                </div>
            </div>

            <div className="w-[24px]">
                <CompletePhrase phraseId={phraseId} />
            </div>
        </div>
    )
}