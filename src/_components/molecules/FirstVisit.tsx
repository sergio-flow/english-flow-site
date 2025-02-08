"use client"

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import fetchIpInfo from "@/_utils/fetchIpInfo"
import { Language } from "@/_utils/fetchLanguages"
import { redirect } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Link from 'next/link'
import Image from 'next/image'
import resolveTranslations from '@/_utils/resolveTranslations'

type Params = {
    languages: Language[]
}

const FirstVisit = (params: Params) => {
    const [open, setOpen] = useState(false)
    const [language, setLanguage] = useState<Language | null>(null)
    const [welcomeText, setWelcomeText] = useState('')
    const [welcomeDescription, setWelcomeDescription] = useState('')

    const firstRunRef = useRef(true)

    useEffect(() => {
        const handleVisit = async () => {
            // const cached = localStorage.getItem('firstVisit')
            // if (cached) return

            localStorage.setItem('firstVisit', 'true')
            const ipInfo = await fetchIpInfo()

            const language = params.languages.find(l => l.countryCode.toUpperCase() === ipInfo.country.toUpperCase())

            if (language) {
                const welcomeText = `Welcome to English Flow!`
                const welcomeDescription = `We noticed you are from ${language.countryName} — would you like to visit the site in the local language?`

                const translations = await resolveTranslations({
                    allTexts: {
                        firstVisitTexts: {
                            welcomeText,
                            welcomeDescription
                        },
                    },
                    languageCode: language.languageCode,
                    countryCode: language.countryCode
                })

                setWelcomeText(translations.firstVisitTexts.welcomeText)
                setWelcomeDescription(translations.firstVisitTexts.welcomeDescription)

                setLanguage(language)
                setOpen(true)
            }
        }

        if (firstRunRef.current) {
            firstRunRef.current = false
            handleVisit()
        }
    }, [])

    const handleRedirect = () => {
        const url = `/${language?.countryCode.toLowerCase()}/${language?.languageCode.toLowerCase()}`
        redirect(url)
        setOpen(false)
    }

    if (!open || !language) return null

    const countryCode = language.countryCode.toLowerCase()
    const languageCode = language.languageCode.toLowerCase()
    const url = `/${countryCode}/${languageCode}`

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen">
                <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative w-full px-10 transform pt-10 pb-8 overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <button className='absolute cursor-pointer top-4 right-4' onClick={() => setOpen(false)}>
                            <svg className='size-8' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" aria-hidden="true" data-slot="icon"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg>
                        </button>

                        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
                            <Image
                                width={56}
                                height={56}
                                alt="English Flow"
                                src="/logo.png"
                                className="mx-auto h-14 w-auto"
                            />

                            <h2 className="text-white text-lg font-semibold mt-8 text-center">{welcomeText}</h2>
                            <p className='text-white/60 mt-2 text-center'>{welcomeDescription}</p>
                        </div>

                        <Link
                            href={url}
                            className="flex cursor-pointer items-center justify-center gap-2 py-3 px-2 rounded-lg hover:bg-white/15 bg-white/10"
                        >
                            <span className={`em em-${countryCode === 'id' ? 'indonesia' : countryCode} em-flag-${countryCode}`} />
                            <span className="text-white font-semibold text-sm">{language.countryName}</span>
                        </Link>

                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default FirstVisit