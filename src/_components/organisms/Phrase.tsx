import CardContent from "../molecules/CardContent";
import CardHeader from "../molecules/CardHeader";

export default function Phrase() {
    return (
        <div className="rounded-lg p-4 pb-2 pt-2 border shadow-sm  bg-gray-800 border-gray-700 flex flex-col gap-4 mb-8">
            <CardHeader accent="american" gender="male" shortDescription="I'm sorry, I'm late" />
            <CardContent audio="sorry.mp3" phrase="I'm sorry, I'm late" />
        </div>
    )
}