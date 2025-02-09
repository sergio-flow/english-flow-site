import imageUrl from "@/_utils/imageUrl";
import Image from "next/image";
import Link from "next/link";

type Article = {
    title: string;
    image: string;
    slug: string;
    contentJson: [
        {
            [key: string]: string | { text: string }[];
        }
    ],
    tagsJson: { emoji: string, text: string }[];
}

type Params = {
    title: string;
    countryCode: string;
    languageCode: string;
    articles: Article[];
    // texts: { [key: string]: string };
}

export default function SpeakLikeArticles(params: Params) {
    const { title, countryCode, languageCode, articles } = params

    return (
        <div className="container mx-auto max-w-4xl py-4 px-4 pb-40">
            <h1 className="text-white text-3xl font-bold mb-14 mt-8">
                {title}
            </h1>

            <div className="grid grid-cols-2 gap-8">
                {articles.map((article, index) => (
                    <Link href={`/${countryCode}/${languageCode}/speak-like-x/${article.slug}`} className="flex flex-col gap-4" key={index}>
                        <Image
                            src={imageUrl(article.image)}
                            alt={""}
                            width={800}
                            height={400}
                            className="rounded-lg cover"
                        />

                        <h2 className="text-white text-xl font-bold">
                            {article.title}
                        </h2>

                        <div className="flex items-center gap-6 mb-4 mt-0">
                            {article.tagsJson.map((tag: { text: string, emoji: string }, index: number) => (
                                <p key={index} className="text-white/60 font-semibold text-xs mb-2 flex items-top gap-2">
                                    <i className={`em ${tag.emoji}`} />
                                    <span>{tag.text}</span>
                                </p>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}