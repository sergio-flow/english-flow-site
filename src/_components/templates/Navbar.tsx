import Image from "next/image";
import Link from "next/link";

// type Params = {
//     texts: { [key: string]: string }
// }

type Params = {
    countryCode: string;
    languageCode: string;
    page: string;
    texts: { [key: string]: string };
}

export default function Navbar(params: Params) {
    const { countryCode, languageCode, page, texts } = params;

    const baseUrl = `/${countryCode.toLowerCase()}/${languageCode.toLowerCase()}`

    return (
        <div className=" mb-10 border-b border-white/10">
            <div className="flex w-full xl:w-[1340px] mx-auto px-4 py-4 gap-10">
                <Link href={baseUrl} className="flex align-center items-center gap-4">
                    <Image
                        width={40}
                        height={40}
                        src="/logo.png"
                        alt="English Flow"
                        className="h-[40px] w-auto"
                    />

                    <div className="text-sm w-[80px] md:w-auto uppercase font-bold text-white">English Flow</div>
                </Link>

                <div className="flex items-center border-l border-white/10 pl-4">
                    <Link href={baseUrl} className={`text-xs font-semibold uppercase py-2 px-4 rounded-lg text-white ${page === 'all-phrases' ? "bg-white/10" : "hover:text-white hover:bg-white/10"} mx-1`}>{texts.phrases}</Link>
                    <Link href={`${baseUrl}/speak-like-x`} className={`text-xs font-semibold uppercase py-2 px-4 rounded-lg text-white ${page === 'speak-like-x' ? "bg-white/10" : "hover:text-white hover:bg-white/10"} mx-1`}>{texts.speakLike}</Link>
                    {/* <Link href="/articles" className="text-xs font-semibold uppercase text-white/60 py-2 px-4 rounded-lg hover:text-white hover:bg-white/10 mx-1">{texts.aboutUs}</Link>
                    <Link href="/blog" className="text-sm font-semibold uppercase text-white py-2 px-4 rounded-lg hover:bg-white/10">Blog</Link> */}
                </div>
            </div>
        </div>
    )
}

export const texts = {
    name: 'English Flow',
    phrases: 'All Phrases',
    speakLike: 'Speak Like «X»',
    articles: 'Articles',
    aboutUs: 'About us',
}