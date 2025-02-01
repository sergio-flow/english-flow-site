import Filter from "../molecules/Filter";
import Phrase from "../organisms/Phrase";

type Params = {
    phrases: any[];
}

export default function Phrases(params: Params) {
    const { phrases } = params

    return (
        <div className="flex w-[1440px] mx-auto px-4 py-6 gap-10">
            <div className="w-[280px]">
                {filters.map((filter, filterIdx) => (
                    <Filter
                        {...filter}
                        key={filter.id}
                    />
                ))}
            </div>

            <div className="flex-1">
                <div className="columns-3 gap-8">
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

const filters = [
    {
        id: "by-gender",
        name: "Gender",
        options: [
            { value: 'male', label: 'Male 👨', checked: true },
            { value: 'female', label: 'Female 👩‍🦰', checked: true },
        ]
    },
    {
        id: "by-accent",
        name: "Accent",
        options: [
            { value: 'american', label: 'American English 🇺🇸', checked: true },
            { value: 'british', label: 'British English 🇬🇧', checked: true },
        ]
    },
    {
        id: "by-conversation",
        name: "Conversation",
        options: [
            { value: 'starting', label: 'Starting a Conversation ✨', checked: true },
            { value: 'keeping', label: 'Continuing the Dialogue 💬', checked: true },
            { value: 'deeper', label: 'Getting Deeper ❤️‍🔥', checked: true },
            { value: 'changing', label: 'Changing the Topic 🌈', checked: true },
            { value: 'jumping', label: 'Jumping In 🙋‍♀️', checked: true },
            { value: 'clearing', label: 'Clearing Things Up 🤔', checked: true },
            { value: 'disagreeing', label: 'Disagreeing Respectfully 💞', checked: true },
            { value: 'agreeing', label: 'Agreeing and Supporting 🤗', checked: true },
            { value: 'ending', label: 'Ending a Conversation 🌙', checked: true },
        ]
    },
    // {
    //     id: "by-emotion",
    //     name: "Expressing something",
    //     options: [
    //         { value: 'white', label: 'Expressing anger', checked: false },
    //         { value: 'beige', label: 'Expressing disgust', checked: false },
    //         { value: 'blue', label: 'Expressing gratitude', checked: true },
    //         { value: 'brown', label: 'Expressing love', checked: false },
    //         { value: 'green', label: 'Expressing action', checked: false },
    //         { value: 'purple', label: 'Expressing intention', checked: false },
    //     ]
    // },
]