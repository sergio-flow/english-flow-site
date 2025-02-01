export default function Hero() {
    return (
        <div className="w-[1440px] mx-auto px-4 py-6 gap-10 mb-6">
            <h1 className="text-4xl font-semibold text-white mb-4 mt-4">
                English phrases used in everyday conversation
            </h1>
            <h2 className="text-2xl leading-[2xl] text-white/40">
                Practice common phrases in English
                <br />
                by following a 3-step process:
                <br />
                <span className="bg-[#69d6e1] w-[28px] inline-block font-bold text-center rounded-4xl align-top text-white text-lg mt-[3px] mr-[10px]">1</span>
                Listen →
                <span className="bg-[#69d6e1] w-[28px] inline-block font-bold text-center rounded-4xl align-top text-white text-lg mt-[3px] mr-[2px] ml-[10px] mr-[10px]">2</span>
                Record →
                <span className="bg-[#69d6e1] w-[28px] inline-block font-bold text-center rounded-4xl align-top text-white text-lg mt-[3px] mr-[2px] ml-[10px]">3</span> Compare
            </h2>
        </div>
    )
}