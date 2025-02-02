import CardContent from "../molecules/CardContent";
import CardFooter from "../molecules/CardFooter";
import CardHeader from "../molecules/CardHeader";

type Params = {
    phrase: any
}

export default function Phrase(params: Params) {
    const { phrase: phraseObject } = params

    const {
        id,
        accent,
        phrase,
        gender,
        audio,
        short_description: shortDescription
    } = phraseObject

    return (
        <div className="rounded-lg border shadow-sm bg-gray-800 border-gray-700 flex flex-col gap-4 mb-2">
            <CardHeader phraseId={id} accent={accent} gender={gender} shortDescription={shortDescription} />
            <CardContent audio={audio} phrase={phrase} />
            <CardFooter />
        </div>
    )
}