import React, { useState, useMemo } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import clsx from 'clsx';

export default function SearchableSelect({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "Pilih opsi...", 
    labelKey = "label", 
    valueKey = "value",
    error,
    disabled = false,
    className = ""
}) {
    const [query, setQuery] = useState('');
    const MAX_DISPLAY = 50; // Batasi jumlah item yang dirender untuk performa

    const filteredOptions = useMemo(() => {
        const cleanQuery = query.toLowerCase().trim();
        
        if (cleanQuery === '') return options.slice(0, MAX_DISPLAY);

        const filtered = [];
        for (const option of options) {
            const label = typeof option === 'object' ? option[labelKey] : option;
            if (label?.toString().toLowerCase().includes(cleanQuery)) {
                filtered.push(option);
            }
            if (filtered.length >= MAX_DISPLAY) break;
        }
        return filtered;
    }, [options, query, labelKey]);

    const selectedOption = useMemo(() => 
        options.find(opt => (typeof opt === 'object' ? opt[valueKey] : opt) == value)
    , [options, value, valueKey]);

    return (
        <div className={clsx("w-full", className)}>
            <Combobox value={value} onChange={onChange} disabled={disabled}>
                <div className="relative mt-1">
                    <div className={clsx(
                        "relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-left border focus-within:ring-2 focus-within:ring-emerald-600 sm:text-sm transition-all",
                        error ? "border-red-500" : "border-slate-300 dark:border-slate-700",
                        disabled ? "opacity-75 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50" : ""
                    )}>
                        <Combobox.Input
                            className="w-full border-none py-2.5 pl-3 pr-10 text-sm leading-5 text-slate-900 dark:text-white focus:ring-0 bg-transparent"
                            displayValue={() => selectedOption ? (typeof selectedOption === 'object' ? selectedOption[labelKey] : selectedOption) : ''}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={placeholder}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown
                                className="h-4 w-4 text-slate-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-200 dark:border-slate-700">
                            {filteredOptions.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-slate-700 dark:text-slate-300">
                                    Tidak ada data ditemukan.
                                </div>
                            ) : (
                                filteredOptions.map((option) => {
                                    const optValue = typeof option === 'object' ? option[valueKey] : option;
                                    const optLabel = typeof option === 'object' ? option[labelKey] : option;
                                    
                                    return (
                                        <Combobox.Option
                                            key={optValue}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-emerald-600 text-white' : 'text-slate-900 dark:text-white'
                                                }`
                                            }
                                            value={optValue}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {optLabel}
                                                    </span>
                                                    {selected ? (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-emerald-600'}`}>
                                                            <Check className="h-4 w-4" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    );
                                })
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
