'use client'

import { TextInput } from "@mantine/core";
import { ChangeEventHandler } from "react";
import styles from "./css/inputfield.module.css"

type InputFieldProps = {
    itemValue?: string | number;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    className: string;
    placeholder?: string;
}


export default function InputField({ itemValue, onChange, className, placeholder } : InputFieldProps) {
    return(
        <main>
           <TextInput
                className={className}
                classNames={{
                    wrapper: styles.inputWrapper,
                    input: styles.input,
                }}
                value={itemValue}
                onChange={onChange}
                placeholder={placeholder}
            />
        </main>
    );
}