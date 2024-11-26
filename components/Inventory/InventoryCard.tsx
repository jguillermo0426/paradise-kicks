'use client'
import { CardProduct } from '@/types/types';
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Image, Modal, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Epilogue } from 'next/font/google';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import InputField from '../InputField';
import StockInput from './StockInput';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

type CardTestProps = {
    cardProduct: CardProduct;
    onChange: (updatedProduct: CardProduct) => void;
}


export default function CardTest({ cardProduct, onChange }: CardTestProps) {
    const { cardId, modelId, colorId, model, brand, colorway, sizes, image_link, image_file } = cardProduct;

    const [totalStock, setTotalStock] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);
    const [editedSizes, setEditedSizes] = useState({ cardId, modelId, colorId, model, brand, colorway, sizes, image_link, image_file });
    const [invalidStock, isInvalidStock] = useState<boolean[]>([]);
    const [invalidPrice, isInvalidPrice] = useState<boolean[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    useEffect(() => {
        setEditedSizes({ cardId, modelId, colorId, model, brand, colorway, sizes, image_link, image_file });
    }, [cardProduct]);

    useEffect(() => {
        let tempStock = 0;
        sizes.forEach((size) => {
            tempStock += Number(size.stock);
        });
        setTotalStock(tempStock);
    }, [sizes]);

    // const handleStockChange = (item: Size) => {
    //     const updatedSizes = [...editedSizes.sizes, item];

    //     setEditedSizes({
    //         ...editedSizes,
    //         sizes: updatedSizes
    //     });
    // }

    const handleChangeNumber = (e: string | number, index: number, toChange: string) => {
        const updatedSizes = [...editedSizes.sizes];
        
        updatedSizes[index] = {
            ...updatedSizes[index],
            [toChange]: Number(e),
        };
    
    
        const updatedEditedSizes = {
            ...editedSizes,
            sizes: updatedSizes,
        };
    
        setEditedSizes(updatedEditedSizes);
    

        if (toChange === "stock") {
            const stockErrArray = updatedSizes.map((value) => value.stock < 1);
            isInvalidStock(stockErrArray);
        }
    
        if (toChange === "price") {
            const priceErrArray = updatedSizes.map((value) => value.price < 1);
            isInvalidPrice(priceErrArray);
        }

        onChange(updatedEditedSizes);
    };
    

    const handleChangeString = (e: ChangeEvent<HTMLInputElement>, index: number, toChange: string) => {
        const updatedSizes = [...editedSizes.sizes];

        updatedSizes[index] = {
            ...updatedSizes[index],
            [toChange]: e.target.value
        }

        setEditedSizes({
            ...editedSizes,
            sizes: updatedSizes
        });

        // if (toChange === "SKU") {
        //     const skuErrorArray = updatedSizes.map((size, index) => {
        //         const isDuplicate = updatedSizes.some((otherSize, otherIndex) => otherSize.SKU === size.SKU && index !== otherIndex);
        //         return isDuplicate;
        //     });
        // }

        onChange({ ...editedSizes, sizes: updatedSizes });
    }

    const handleChangeCard = (e: ChangeEvent<HTMLInputElement>, toChange: string) => {
        const newValue = e.target.value;

        // Create a new object based on editedSizes
        const updatedSizes = { ...editedSizes, [toChange]: newValue };

        // Update local state first
        setEditedSizes(updatedSizes);

        // Call onChange with the updated values
        onChange(updatedSizes);
    }

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input when the label is clicked
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // setFile(e.target.files[0]);
            setPreviewURL(URL.createObjectURL(e.target.files[0]));
            const updatedSizes = { ...editedSizes, image_file: e.target.files[0] };
            onChange(updatedSizes)
        } else {
            // setFile(undefined);
            console.log('no file uploaded');
        }
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                centered
                radius={20}
                size="auto"
            >
                {sizes.map((item, index) => { 
                    return (
                        <div className='flex flex-col items-start justify-center p-8' key={index}>
                            <div className='flex flex-row items-center justify-between w-full'>
                                <p style={epilogue.style} className='font-semibold text-[32px]'>{item.SKU}</p>

                                <StockInput item={item} handleChangeNumber={handleChangeNumber} index={index} invalidStock={invalidStock} />
                            </div>

                            <div className='flex flex-row items-center'>
                                <div className='flex flex-col mr-6'>
                                    <p style={epilogue.style} className="font-semibold text-[16px]">Size</p>
                                    <InputField
                                        itemValue={item.size}
                                        onChange={(e) => handleChangeString(e, index, "size")}
                                        className="font-normal text-[14px] w-[17vw]"
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <p style={epilogue.style} className="font-semibold text-[16px]">Price</p>
                                    <NumberInput
                                        hideControls
                                        value={item.price}
                                        onChange={(e) => handleChangeNumber(e, index, "price")}
                                        className="font-normal text-[14px] w-[17vw]"
                                        error={invalidPrice[index] ? "Price is not a valid number" : ""}
                                        withErrorStyles={invalidPrice[index]}
                                    />
                                </div>
                            </div>

                            <Divider orientation='horizontal' className='w-full mt-8 border-[#B1B1B1]' color="black" />
                        </div>
                    );
                })}
            </Modal>

            <div className='w-[19rem] h-[31rem] border-solid border-2 rounded-lg border-black mx-10 my-10 px-5 py-12'>
                <div className='flex flex-row w-full'>
                    <div className='w-[100px] h-[100px] mr-5'>
                        <Image
                            radius="md"
                            src={previewURL ? previewURL : image_link}
                            h={100}
                            w={100}
                            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                            fit="cover"
                        />
                    </div>

                    <div className='flex flex-col w-[100px]'>
                        <p style={epilogue.style} className="font-semibold text-[16px]">Total Stock</p>
                        <p style={epilogue.style} className="font-normal text-[14]">{totalStock}</p>

                        <Divider size="sm" className='w-full my-3' />

                        <div onClick={handleClick} className='hover:cursor-pointer flex flex-row items-start justify-start'>
                            <PencilSquareIcon className="h-5 w-5 text-[#38bdba] mr-2" />
                            <label
                                className='text-[#38bdba] text-sm cursor-pointer'
                            >
                                Edit Image
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden" // Hide the default file input
                                accept="image/*" // Optional: limit to image files
                            />
                        </div>
                    </div>
                </div>

                <p style={epilogue.style} className="font-semibold text-[16px] mt-5">Model</p>
                <InputField
                    itemValue={editedSizes.model}
                    onChange={(e) => handleChangeCard(e, "model")}
                    className="font-normal text-[14px]"
                />

                <p style={epilogue.style} className="font-semibold text-[16px] mt-5">Brand</p>
                <InputField
                    itemValue={editedSizes.brand}
                    onChange={(e) => handleChangeCard(e, "brand")}
                    className="font-normal text-[14px]"
                />

                <p style={epilogue.style} className="font-semibold text-[16px] mt-5">Colorway:</p>
                <InputField
                    itemValue={editedSizes.colorway}
                    onChange={(e) => handleChangeCard(e, "colorway")}
                    className="font-normal text-[14px]"
                />

                <div className='w-full flex justify-center items-center my-5'>
                    <Button
                        variant='outline'
                        styles={{
                            root: {
                                border: "solid 2px #177F7D",
                                color: "#177F7D",
                            }
                        }}
                        onClick={open}
                    >
                        See Stock
                    </Button>
                </div>
            </div>
        </>
    );
}