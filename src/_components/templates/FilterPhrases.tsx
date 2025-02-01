import Filter from "../molecules/Filter";
import Phrase from "../organisms/Phrase";

export default function Phrases() {
    return (
        <div className="flex w-[1440px] mx-auto px-4 py-20 gap-10">
            <div className="w-[280px] column-1">
                <Filter />
                <Filter />
            </div>

            <div className="flex-1">
                <h1 className="text-4xl font-semibold text-white mb-8 mt-4">Phrases
                    <span className="ml-2 text-gray-400">
                        (820 results)
                    </span>
                </h1>

                <div className="columns-3 gap-8">
                    <Phrase />
                    <Phrase />
                    <Phrase />
                    <Phrase />
                    <Phrase />
                    <Phrase />
                </div>
            </div>

            {/* <div className="w-[280px] column-3">
                <p>Ads</p>
            </div> */}
        </div>
    )
}