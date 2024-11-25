'use client'
import { ActionIcon, NumberInput, NumberInputHandlers } from "@mantine/core";
import styles from "../css/inputfield.module.css";
import { Epilogue } from 'next/font/google';
import { useRef } from "react";
import { Size } from "@/types/types";

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

type StockProps = {
    item: Size;
    handleChangeNumber: (e: string | number, index: number, toChange: string) => void;
    index: number;
    invalidStock: boolean[];
}


export default function StockInput({ item, handleChangeNumber, index, invalidStock } : StockProps) {
    const handlersRefs = useRef<NumberInputHandlers>(null);
    return (
        <div className='flex flex-row items-center justify-start'>
            <p style={epilogue.style} className="font-semibold text-[16px] mx-2">Stock</p>
            <ActionIcon
                styles={{
                    root: {
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0",
                        textAlign: "center",
                        backgroundColor: "#38bdba",
                        border: "1px solid #38bdba",
                        color: "white"
                    }
                }}
                style={epilogue.style}
                size={40}
                variant="default"
                onClick={() => handlersRefs.current?.decrement()}
                className="font-bold text-[20px]"
            >
                -
            </ActionIcon>
            <NumberInput
                classNames={{
                    wrapper: styles.numberWrapper,
                    input: styles.numberInput,
                }}
                hideControls
                style={epilogue.style}
                className="font-bold text-[20px]"
                handlersRef={handlersRefs}
                value={item.stock}
                step={1}
                min={0}
                onChange={(e) => handleChangeNumber(e, index, "stock")}
                withErrorStyles={invalidStock[index]}
            />
            <ActionIcon
                styles={{
                    root: {
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0",
                        textAlign: "center",
                        backgroundColor: "#38bdba",
                        border: "1px solid #38bdba",
                        color: "white"
                    }
                }}
                style={epilogue.style}
                size={40}
                variant="default"
                className="font-bold text-[20px]"
                onClick={() => handlersRefs.current?.increment()}
            >
                +
            </ActionIcon>
        </div>
    );
}