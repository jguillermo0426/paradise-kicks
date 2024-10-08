'use client'

import { TextInput } from "@mantine/core";
import { ChangeEventHandler } from "react";
import styles from "./css/inputfield.module.css"

type InputFieldProps = {
    itemValue?: string | number;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    className: string;
    placeholder?: string;
    error?: React.ReactNode;
    withErrorStyles?: boolean | undefined;
}


export default function InputField({ itemValue, onChange, className, placeholder, error, withErrorStyles } : InputFieldProps) {
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
                error={error}
                withErrorStyles={withErrorStyles}
            />
        </main>
    );
}