import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { checkboxIcon } from "../atoms/Icons";
import { redirect } from 'next/navigation'
import Link from 'next/link';


type Params = {
    id: string;
    name: string;
    options: {
        value: string;
        label: string;
        checked: boolean;
    }[];
    searchParams: any;
}

export default function Filter(params: Params) {
    const { id, name, options, searchParams } = params;

    const queryValues = searchParams[id] ? decodeURIComponent(searchParams[id]).split(",") : []
    console.log("qv", queryValues)

    const generateOptionUrl = (option: string) => {
        const newOptionValue = queryValues.includes(option)
            ? queryValues.filter((value: any) => value !== option).join(",")
            : [...queryValues, option].join(",")

        const currentSearchParams: any = {}

        for (const key in searchParams) {
            if (!searchParams[key]) continue
            currentSearchParams[key] = searchParams[key]
        }

        const newSearchParams = {
            ...currentSearchParams,
            [id]: newOptionValue
        }

        return `?${new URLSearchParams(newSearchParams).toString()}`
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
                    {options.map((option, optionIdx) => (
                        <Link href={generateOptionUrl(option.value)} key={option.value} className="flex items-center gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-5 grid-cols-1">
                                    <input
                                        defaultValue={option.value}
                                        defaultChecked={queryValues.includes(option.value)}
                                        id={`filter-${id}-${optionIdx}`}
                                        name={`${id}[]`}
                                        type="checkbox"
                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-orange-400 checked:bg-orange-400 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                    />

                                    {checkboxIcon()}
                                </div>
                            </div>
                            <label htmlFor={`filter-${id}-${optionIdx}`} className="text-md text-white pb-[1px] pr-[40px] flex-1 relative">
                                {option.label} ({queryValues.includes(option.value) ? 'checked' : 'unchecked'})

                                <span className="text-xs text-gray-400 ml-2 text-center leading-[25px] w-[25px] h-[25px] absolute font-bold text-white rounded-2xl bg-gray-700 top-0 bottom-0 right-[0px]">
                                    12
                                </span>
                            </label>
                        </Link>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}