"use client"

import { apiBaseUrl } from '@/_constants/environment';
import TypePhrase from '@/_types/TypePhrase';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown'

type Params = {
    countryCode: string;
    languageCode: string;
    phrase: TypePhrase;
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function StudyModal(params: Params) {
    const { countryCode, languageCode, phrase, open, setOpen } = params

    const [loading, setLoading] = useState(false)
    const [studyMaterial, setStudyMaterial] = useState<string | null>(null)

    useEffect(() => {
        if (open) getStudyMaterial()
    }, [open, countryCode, languageCode, phrase])

    const getStudyMaterial = async () => {
        if (loading) return

        setLoading(true)

        const data = await fetch(`${apiBaseUrl}/api/get-study-material`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ countryCode, languageCode, phraseId: phrase.id }),
        });

        const { studyMaterial } = await data.json();

        setStudyMaterial(studyMaterial)
        setLoading(false)
    }

    const handleClose = () => {
        setOpen(false)
        setLoading(false)
        setStudyMaterial(null)
    }

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative w-full px-10 transform pt-10 pb-12 overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
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
                        </div>

                        {!studyMaterial && (
                            <div className="flex align-center justify-center my-20" role="status">
                                <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-orange-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}

                        {studyMaterial && (
                            <Markdown
                                className={"text-white"}
                                components={{
                                    ul(props) {
                                        const { node, ...rest } = props // eslint-disable-line @typescript-eslint/no-unused-vars
                                        return <ul className="list-inside list-disc text-left text-white mb-2" {...rest} />
                                    },
                                    h1: function h1(props) {
                                        const { node, ...rest } = props // eslint-disable-line @typescript-eslint/no-unused-vars
                                        return <h1 className="text-xl font-semibold text-white mt-4 mb-2" {...rest} />
                                    },
                                    h2(props) {
                                        const { node, ...rest } = props // eslint-disable-line @typescript-eslint/no-unused-vars
                                        return <h2 className="text-lg font-semibold text-white mt-4 mb-2" {...rest} />
                                    },
                                    h3(props) {
                                        const { node, ...rest } = props // eslint-disable-line @typescript-eslint/no-unused-vars
                                        return <h3 className="text-sm font-semibold text-white/40 uppercase mt-4 mb-2" {...rest} />
                                    },
                                    hr(props) {
                                        const { node, ...rest } = props // eslint-disable-line @typescript-eslint/no-unused-vars
                                        return <hr className="border-t border-white/20 my-6" {...rest} />
                                    },
                                }}
                            >
                                {`${studyMaterial}`}
                            </Markdown>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

const test = `
# Analiza frazei: "This is a picture of Mike Johnson, and his wife"

## 1. **This is**
- **This**: Pronume demonstrativ („acesta”/„aceasta”).
- **is**: Forma de prezent a lui „to be” („este”).
- **Combinație**: „Aceasta este”.

## 2. **a picture**
- **a**: Articol nehotărât („o”).
- **picture**: Substantiv („imagine”/„fotografie”).
- **Combinație**: „O imagine”/„O fotografie”.

## 3. **of Mike Johnson**
- **of**: Prepoziție („a lui”/„cu”).
- **Mike Johnson**: Nume propriu („Mike Johnson”).
- **Combinație**: „A lui Mike Johnson”.

## 4. **and his wife**
- **and**: Conjuncție („și”).
- **his**: Pronume posesiv („a lui”).
- **wife**: Substantiv („soție”).
- **Combinație**: „Și soția lui”.

---

### Traducere:
**„This is a picture of Mike Johnson, and his wife”** = **„Aceasta este o fotografie a lui Mike Johnson și a soției lui”**.
`