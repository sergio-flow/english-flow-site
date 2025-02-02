export default function Hero() {
    return (
        <div className="w-[1440px] mx-auto px-4 py-6 gap-10 mb-6">
            <div className="country-language flex items-center gap-4 mb-10">
                <div className="flex cursor-pointer items-center gap-2 p-1 px-2 pr-3 rounded-lg bg-white/10">
                    <span className="em em-flag-md" />
                    <span className="text-white font-semibold text-md">Moldova</span>
                </div>
                <span className="text-white text-lg">→</span>
                <div className="flex items-center rounded-lg bg-white/10">
                    <div className="rounded-l-lg cursor-pointer text-white py-1 px-2 font-semibold text-md bg-orange-400">Română</div>
                    <div className="rounded-r-lg cursor-pointer text-white py-1 px-2 font-semibold text-md">Русский</div>
                </div>
            </div>

            <h1 className="text-4xl font-semibold text-white mb-4 mt-4">{texts.title}</h1>
            <h2 className="text-2xl leading-[2xl] text-white/40">
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
    title: 'Practice common phrases in English',
    description1: '1. Understand English by studying phrases individually.',
    description2: '2. Improve your speaking skills by recording your voice.',
}