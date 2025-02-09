import TypePhrase from "@/_types/TypePhrase";
import imageUrl from "@/_utils/imageUrl";
import Image from "next/image";
import Phrase from "../organisms/Phrase";

type Article = {
    title: string;
    image: string;
    contentJson: [
        {
            [key: string]: string | { text: string }[];
        }
    ],
    tagsJson: { emoji: string, text: string }[];
}

type Params = {
    languageCode: string;
    article: Article;
    phrases: TypePhrase[];
    texts: { [key: string]: string };
}

export default function SpeakLikeArticle(params: Params) {
    const { title, image, contentJson, tagsJson } = params.article

    return (
        <div className="container mx-auto max-w-3xl py-4 px-4 pb-20">
            <Image
                src={imageUrl(image)}
                alt={""}
                width={800}
                height={400}
                className="rounded-lg cover mb-8"
            />

            <h1 className="text-white text-3xl font-bold mb-2 mt-14">
                {title}
            </h1>

            <div className="flex items-center gap-6 mb-4 mt-4">
                {tagsJson.map((tag: { text: string, emoji: string }, index: number) => (
                    <p key={index} className="text-white/60 font-semibold text-xs mb-2 flex items-top gap-2">
                        <i className={`em ${tag.emoji}`} />
                        <span>{tag.text}</span>
                    </p>
                ))}
            </div>

            {contentJson.map(
                (
                    section: { [key: string]: string | { text: string }[] },
                    index: number
                ) => {
                    if (section['paragraph'] && Array.isArray(section['paragraph'])) {
                        return (
                            <p key={index} className="text-white mb-4">
                                {section['paragraph'].map(
                                    (paragraph: { text: string }, secondIndex: number) => (
                                        <span key={`${index}-${secondIndex}`} className="inline">
                                            {paragraph.text} &nbsp;
                                        </span>
                                    )
                                )}
                            </p>
                        )
                    }

                    if (section['paragraph']) {
                        return (
                            <p key={index} className="text-white mb-4">
                                {section['paragraph']}
                            </p>
                        )
                    }

                    if (section['showDivider']) {
                        return (
                            <hr key={index} className="border-white/10 my-16" />
                        )
                    }

                    if (section['showPhrase']) {
                        const phrase = params.phrases.find((o) => o.id === parseInt(section['showPhrase'] as string, 10))

                        if (!phrase) return null

                        return (
                            <div className="my-4 mb-6 max-w-[600px]" key={index}>
                                <Phrase
                                    languageCode={params.languageCode}
                                    phrase={phrase}
                                    texts={params.texts}
                                />
                            </div>
                        )
                    }

                    if (section['headline']) {
                        return (
                            <h3 key={index} className="text-white font-semibold text-lg mt-8 mb-2">
                                {Array.isArray(section['headline'])
                                    ? section['headline'].map((item, idx) => (
                                        <span key={idx}>{item.text}</span>
                                    ))
                                    : section['headline']}
                            </h3>
                        )
                    }

                    return null
                })}
        </div>
    )
}