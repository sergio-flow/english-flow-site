import Image from "next/image";
import Link from "next/link";

type Params = {
    texts: { [key: string]: string }
}

export default function Navbar(params: Params) {
    const { texts } = params

    return (
        <div className=" mb-10 border-b border-white/10">
            <div className="flex w-[1440px] mx-auto px-4 py-4 gap-10">
                <Link href="/" className="flex align-center items-center gap-4">
                    <Image
                        width={40}
                        height={40}
                        src="/logo.png"
                        alt="English Flow"
                        className="h-[40px] w-auto"
                    />

                    <div className="text-sm w-[80px] md:w-auto uppercase font-bold text-white">{texts.name}</div>
                </Link>

                <div className="flex items-center border-l border-white/10 pl-4">
                    <Link href="/articles" className="text-sm font-semibold uppercase py-2 px-4 rounded-lg text-white bg-white/10 mx-1">{texts.phrases}</Link>
                    <Link href="/articles" className="text-sm font-semibold uppercase text-white/60 py-2 px-4 rounded-lg hover:text-white hover:bg-white/10 mx-1">{texts.articles}</Link>
                    <Link href="/articles" className="text-sm font-semibold uppercase text-white/60 py-2 px-4 rounded-lg hover:text-white hover:bg-white/10 mx-1">{texts.aboutUs}</Link>
                    {/* <Link href="/blog" className="text-sm font-semibold uppercase text-white py-2 px-4 rounded-lg hover:bg-white/10">Blog</Link> */}
                </div>
            </div>
        </div>
    )
}

export const texts = {
    name: 'English Flow',
    phrases: 'Phrases',
    articles: 'Articles',
    aboutUs: 'About us',
}