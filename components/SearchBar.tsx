'use client'

import { TextInput } from "@mantine/core";
import { useState } from "react";
import styles from "./css/searchbar.module.css"

export default function SearchBar() {
    const [value, setValue] = useState('');

    return(
        <main>
           <TextInput
                classNames={{
                    wrapper: styles.inputWrapper,
                    input: styles.input,
                }}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                placeholder="Search"
            />
        </main>
    );
}