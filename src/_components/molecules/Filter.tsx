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

const section = {
    id: 'color',
    name: 'Filter by emotion',
    options: [
        { value: 'white', label: 'Expressing anger', checked: false },
        { value: 'beige', label: 'Expressing disgust', checked: false },
        { value: 'blue', label: 'Expressing gratitude', checked: true },
        { value: 'brown', label: 'Expressing love', checked: false },
        { value: 'green', label: 'Expressing action', checked: false },
        { value: 'purple', label: 'Expressing intention', checked: false },
    ],
}

export default function Filter() {
    return (
        <Disclosure key={section.id} as="div" className="border-b border-white/20 py-6">
            <h3 className="-my-3 flow-root">
                <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm text-white/20 hover:text-gray-500">
                    <span className="text-lg font-semibold text-white">{section.name}</span>
                    <span className="ml-6 flex items-center">
                        <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                        <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
                <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-5 grid-cols-1">
                                    <input
                                        defaultValue={option.value}
                                        defaultChecked={option.checked}
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        type="checkbox"
                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-orange-400 checked:bg-orange-400 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                    />

                                    {checkboxIcon()}
                                </div>
                            </div>
                            <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-md text-white pb-[1px]">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}