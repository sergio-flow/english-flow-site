import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import VolumePhrases from './VolumePhrases';
import VolumeRecordings from './VolumeRecordings';
import Image from 'next/image';
import TypePhrase from '@/_types/TypePhrase';

type Params = {
    id: string;
    name: string;
    options: {
        value: string;
        label: string;
        emoji?: string;
        image?: string;
    }[];
    searchParams: { [key: string]: string };
    phrases: TypePhrase[];
}

export default function Filter(params: Params) {
    const { id, name, options, searchParams, phrases } = params;

    const queryValues = searchParams[id] ? decodeURIComponent(searchParams[id]) : []

    const generateOptionUrl = (option: string) => {
        const newOptionValue = queryValues === option ? null : option

        const currentSearchParams: { [key: string]: string } = {}

        for (const key in searchParams) {
            if (!searchParams[key]) continue
            currentSearchParams[key] = searchParams[key]
        }

        if (newOptionValue) {
            currentSearchParams[id] = newOptionValue
        } else {
            delete currentSearchParams[id]
        }

        return `?${new URLSearchParams(currentSearchParams).toString()}`
    }

    const countPhrases = (id: string, value: string) => {
        return phrases.filter((phrase: TypePhrase) => {
            const phraseEntries = Object.entries(phrase)

            const hasValue = phraseEntries.find(([key, val]) => {
                return key === id && val === value
            })

            return hasValue
        }).length
    }


    return (
        <Disclosure defaultOpen={true} key={id} as="div" className="border-b border-white/20 py-6">
            <h3 className="-my-3 flow-root">
                <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm text-white/20 hover:text-gray-500">
                    <span className="text-lg font-semibold text-white">{name}</span>
                    <span className="ml-6 flex items-center">
                        <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                        <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
                <div className="space-y-4">
                    {options.map((option) => (
                        <Link href={generateOptionUrl(option.value)} key={option.value} className={`flex my-[5px] items-center py-[5px] px-[10px] mx-[-10px] rounded-4xl text-md text-white pr-[40px] flex-1 relative gap-3 ${queryValues === option.value ? "bg-white/10" : "hover:bg-white/10"}`}>
                            {option.emoji && (
                                <i className={`em ${option.emoji} text-md`} />
                            )}

                            {option.image && (
                                <Image width={25} height={25} src={option.image} alt={option.label} className="w-[25px] h-[25px] rounded-2xl" />
                            )}

                            {option.label}

                            <span className="text-xs text-gray-400 ml-2 text-center leading-[25px] w-[25px] h-[25px] absolute font-bold text-white rounded-2xl bg-gray-700 top-auto bottom-auto right-[5px]">
                                {countPhrases(id, option.value)}
                            </span>
                        </Link>
                    ))}

                    {id === 'volume_phrases' && <VolumePhrases />}
                    {id === 'volume_recordings' && <VolumeRecordings />}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}