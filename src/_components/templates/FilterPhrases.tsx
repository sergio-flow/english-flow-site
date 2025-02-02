import { access } from "fs";
import Filter from "../molecules/Filter";
import Phrase from "../organisms/Phrase";

type Params = {
    phrases: any[];
    searchParams: any;
}

export default function Phrases(params: Params) {
    const { phrases, searchParams } = params

    return (
        <div className="flex w-[1440px] mx-auto px-4 py-6 gap-10">
            <div className="w-[280px]">
                {filters(texts).map((filter, filterIdx) => (
                    <Filter
                        {...filter}
                        key={filter.id}
                        searchParams={searchParams}
                    />
                ))}
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-3 gap-8">
                    {phrases.map((phrase, phraseIdx) => (
                        <Phrase phrase={phrase} key={phraseIdx} />
                    ))}
                </div>
            </div>

            {/* <div className="w-[280px] column-3">
                <p>Ads</p>
            </div> */}
        </div>

    )
}

export const texts = {
    gender: "Gender",
    male: "Male",
    female: "Female",
    accent: "Accent",
    american: "American English",
    british: "British English",
    conversation: "Conversation",
    start: "Start a conversation",
    maintain: "Maintain a conversation",
    deeper: "Get deeper",
    change: "Change the topic",
    jumpin: "Jump in",
    clear: "Clear things up",
    disagree: "Disagree respectfully",
    agree: "Agree and supporting",
    end: "End a conversation",
}

type Texts = typeof texts

const filters = (texts: Texts) => ([
    {
        id: "gender",
        name: texts.gender,
        options: [
            { value: 'male', label: `${texts.male} 👨`, checked: true },
            { value: 'female', label: `${texts.female} 👩‍🦰`, checked: true },
        ]
    },
    {
        id: "accent",
        name: texts.accent,
        options: [
            { value: 'american', label: `${texts.american} 🇺🇸`, checked: true },
            { value: 'british', label: `${texts.british} 🇬🇧`, checked: true },
        ]
    },
    {
        id: "conversation",
        name: texts.conversation,
        options: [
            { value: 'start', label: `${texts.start} ✨`, checked: true },
            { value: 'maintain', label: `${texts.maintain} 💬`, checked: true },
            { value: 'deeper', label: `${texts.deeper} ❤️‍🔥`, checked: true },
            { value: 'change', label: `${texts.change} 🌈`, checked: true },
            { value: 'jumpin', label: `${texts.jumpin} 🙋‍♀️`, checked: true },
            { value: 'clear', label: `${texts.clear} 🤔`, checked: true },
            { value: 'disagree', label: `${texts.disagree} 💞`, checked: true },
            { value: 'agree', label: `${texts.agree} 🤗`, checked: true },
            { value: 'end', label: `${texts.end} 🌙`, checked: true },
        ]
    },
])