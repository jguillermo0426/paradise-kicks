'use client'

import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import styles from "./css/searchbar.module.css"

type SearchBarProps = {
    onSearchChange: (value: string) => void;
}


export default function SearchBar({ onSearchChange }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchInput(newValue);
        onSearchChange(newValue);
    };

    return (
        <main className="flex flex-row">
            <TextInput
                classNames={{
                    wrapper: styles.inputWrapper,
                    input: styles.input,
                }}
                className="mx-4"
                value={searchInput}
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                placeholder="Search"
            />

            <Button
                variant='filled'
                styles={{
                    root: {
                        backgroundColor: "#38bdba"
                    }
                }}
                className='pt-2'
            >
                Search
            </Button>
        </main>
    );
}