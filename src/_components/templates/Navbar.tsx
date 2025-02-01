import Link from "next/link";

export default function Navbar() {
    return (
        <div className=" mb-10 border-b border-white/10">
            <div className="flex w-[1440px] mx-auto px-4 py-4 gap-10">
                <Link href="/" className="flex align-center items-center gap-4">
                    <img
                        src="/logo.png"
                        alt="English Flow"
                        className="h-[40px] w-auto"
                    />

                    <div className="text-sm w-[80px] md:w-auto uppercase font-semibold text-white">English Flow</div>
                </Link>
            </div>
        </div>
    )
}