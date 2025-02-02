import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import Image from 'next/image';
import Markdown from 'react-markdown'

type Params = {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function StudyModal(params: Params) {
    const { open, setOpen } = params

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                            {test}
                        </Markdown>
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