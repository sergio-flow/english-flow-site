import Filter from "../molecules/Filter";
import Phrase from "../organisms/Phrase";
import TypePhrase from "@/_types/TypePhrase";

type Params = {
    countryCode: string;
    languageCode: string;
    phrases: TypePhrase[];
    searchParams: { [key: string]: string };
    texts: { [key: string]: string }
}

export default function Phrases(params: Params) {
    const { languageCode, phrases, searchParams, texts } = params

    return (
        <div className="xl:flex xl:w-[1340px] mx-auto px-4 gap-10">
            <div className="w-[280px] my-[-30px] hidden xl:block">
                {filters(texts).map((filter) => (
                    <Filter
                        {...filter}
                        key={filter.id}
                        phrases={phrases}
                        searchParams={searchParams}
                    />
                ))}
            </div>

            <div className="flex-1">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8 pb-20">
                    {phrases.map((phrase, phraseIdx) => (
                        <Phrase
                            // countryCode={countryCode}
                            languageCode={languageCode}
                            texts={texts}
                            phrase={phrase}
                            key={`${phraseIdx}-${phrase.id}`}
                        />
                    ))}
                </div>
            </div>
        </div>

    )
}

export const texts = {
    volume_phrases: "Volume of phrases",
    volume_recordings: "Volume of recordings",
    gender: "Gender",
    male: "Men",
    female: "Women",
    accent: "Accent",
    american: "American accent",
    british: "British accent",
    australian: "Australian accent",
    conversation: "Conversation",
    start: "Start a conversation",
    maintain: "Maintain a conversation",
    deeper: "Deeper conversation",
    change: "Change the topic",
    jumpin: "Jump in the conversation",
    clear: "Clear things up",
    disagree: "Disagree respectfully",
    agree: "Agree and support",
    end: "End a conversation",
    study: 'Study',
    record: 'Record',
    stop: 'Stop',
    play: 'Play recording',
    recording: 'Recording...',
}

const filters = (texts: { [key: string]: string }) => ([
    {
        id: "gender",
        name: texts.gender,
        options: [
            { value: 'male', label: texts.male, image: "/male.png" },
            { value: 'female', label: texts.female, image: "/female.png" },
        ]
    },
    {
        id: "accent",
        name: texts.accent,
        options: [
            { value: 'american', label: texts.american, emoji: "em-us" },
            { value: 'british', label: texts.british, emoji: "em-gb" },
            { value: 'australian', label: texts.australian, emoji: "em-flag-au" },
        ]
    },
    {
        id: "conversation",
        name: texts.conversation,
        options: [
            { value: 'start', label: texts.start, emoji: "em-fire", },
            { value: 'maintain', label: texts.maintain, emoji: "em-badminton_racquet_and_shuttlecock", },
            { value: 'deeper', label: texts.deeper, emoji: "em-heartbeat", },
            { value: 'change', label: texts.change, emoji: "em-rainbow", },
            { value: 'jumpin', label: texts.jumpin, emoji: "em-hand", },
            { value: 'clear', label: texts.clear, emoji: "em-tornado", },
            { value: 'disagree', label: texts.disagree, emoji: "em-grimacing", },
            { value: 'agree', label: texts.agree, emoji: "em-handshake", },
            { value: 'end', label: texts.end, emoji: "em-timer_clock", },
        ]
    },
    {
        id: "volume_phrases",
        name: texts.volume_phrases,
        options: []
    },
    {
        id: "volume_recordings",
        name: texts.volume_recordings,
        options: []
    },
])