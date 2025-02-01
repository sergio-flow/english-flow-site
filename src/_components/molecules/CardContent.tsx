import PlayPhrase from '../atoms/PlayPhrase';

type Params = {
    audio: string;
    phrase: string;
}

export default function CardContent(params: Params) {
    const { audio, phrase } = params

    return (
        <div className='flex items-start gap-2 mt-2 mb-4 px-4'>
            <div className='w-[35px] align-center justify-center flex'>
                <PlayPhrase audio={audio} />
            </div>

            <div className='phrase-parts w-full'>
                <div className="px-[4px] py-[4px] text-lg text-white">
                    <span>{phrase}</span>
                </div>
            </div>
        </div>
    )
}

