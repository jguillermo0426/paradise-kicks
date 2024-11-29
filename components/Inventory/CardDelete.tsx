'use client'

import { Checkbox, Image } from "@mantine/core";
import styles from '../css/card.module.css';
import { Epilogue } from 'next/font/google';
import { Product } from "@/types/types";

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

type DeleteProps = {
    item: Product;
    isChecked: boolean;
    handleCheckboxChange: (product: Product) => void;
}

export default function CardDelete({ item, isChecked, handleCheckboxChange }: DeleteProps) {

    return (
        <div
            className={`w-full h-auto rounded-lg my-5 p-10 flex flex-row items-center justify-between`}
            style={{
                backgroundColor: isChecked ? "#99DDDC" : "#EDEDED",
                border: isChecked ? "1px solid #38BDBA" : "none",
            }}
        >
            <div className="w-[25vw] h-full py-10 flex flex-row items-center justify-start">
                <Checkbox
                    size="md"
                    onChange={() => handleCheckboxChange(item)}
                    classNames={{
                        root: styles.checkbox
                    }}
                />
                <div className='w-[80px] h-[80px] mx-5'>
                    <Image
                        radius="md"
                        src={item.image_link}
                        h={80}
                        w={80}
                        fallbackSrc="/placeholder.svg"
                        fit="cover"
                    />
                </div>

                <p style={epilogue.style} className="font-semibold text-[20px] mx-5">{item.SKU}</p>
            </div>

            <div className="h-full flex flex-col items-start justify-center w-[8vw]">
                <p style={epilogue.style} className="font-semibold text-[20px]">Model</p>
                <p style={epilogue.style} className="font-normal text-[20px]">{item.Model}</p>
            </div>

            <div className="h-full flex flex-col items-start justify-center w-[8vw]">
                <p style={epilogue.style} className="font-semibold text-[20px]">Colorway</p>
                <p style={epilogue.style} className="font-normal text-[20px]">{item.Colorway}</p>
            </div>

            <div className="h-full flex flex-col items-start justify-center w-[8vw]">
                <p style={epilogue.style} className="font-semibold text-[20px]">Stock</p>
                <p style={epilogue.style} className="font-normal text-[20px]">{item.Stock}</p>
            </div>

            <div className="h-full flex flex-col items-start justify-center w-[8vw]">
                <p style={epilogue.style} className="font-semibold text-[20px]">Price</p>
                <p style={epilogue.style} className="font-normal text-[20px]">{item.Price}</p>
            </div>
        </div>

    );
}