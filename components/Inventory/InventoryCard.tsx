'use client'
import { CardProduct } from '@/types/types';
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Image, Modal, NumberInput, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Epilogue } from 'next/font/google';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import ImageUpload from '../ImageUpload';
import InputField from '../InputField';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

type CardTestProps = {
    cardProduct: CardProduct;
    onChange: (updatedProduct: CardProduct) => void;
    editable: boolean;
    setHasErrors: Dispatch<SetStateAction<boolean>>;
}


export default function CardTest({ cardProduct, onChange, editable, setHasErrors }: CardTestProps) {
    const { cardId, modelId, colorId, model, brand, colorway, sizes } = cardProduct;

    const [totalStock, setTotalStock] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);
    const [editedSizes, setEditedSizes] = useState({ cardId, modelId, colorId, model, brand, colorway, sizes });
    const [same, setSame] = useState<boolean[]>([]);
    const [invalidStock, isInvalidStock] = useState<boolean[]>([]);
    const [invalidPrice, isInvalidPrice] = useState<boolean[]>([]);

    useEffect(() => {
        const skuHasErrors = sizes.some((item, index) => same[index]); // Check if any SKU is a duplicate
        const emptyFields = sizes.some((item) => !item.SKU || !item.size || item.price < 1 || item.stock < 1); // Check for empty fields
        const emptyModel = !model || !brand || !colorway;

        setHasErrors(skuHasErrors || emptyFields || emptyModel); // Set error state based on conditions
    }, [sizes, model, brand, colorway]);

    useEffect(() => {
        setEditedSizes({ cardId, modelId, colorId, model, brand, colorway, sizes });
    }, [cardProduct]);

    useEffect(() => {
        let tempStock = 0;
        sizes.forEach((size) => {
            tempStock += Number(size.stock);
        });
        setTotalStock(tempStock);
    }, [sizes]);

    // handles changing the value of the field for numbers
    const handleChangeNumber = (e: string | number, index: number, toChange: string) => {
        const updatedSizes = [...editedSizes.sizes];

        updatedSizes[index] = {
            ...updatedSizes[index],
            [toChange]: Number(e)
        }

        setEditedSizes({
            ...editedSizes,
            sizes: updatedSizes
        });

        if (toChange === "stock") {
            const stockErrArray = updatedSizes.map((value) => {
                if (value.stock < 1) {
                    return true;
                } else {
                    return false;
                }
            });
            isInvalidStock(stockErrArray);
        }

        if (toChange === "price") {
            const priceErrArray = updatedSizes.map((value) => {
                if (value.price < 1) {
                    return true;
                } else {
                    return false;
                }
            });
            isInvalidPrice(priceErrArray);
        }

        onChange({ ...editedSizes, sizes: updatedSizes })
    }

    // handles changing the value of the field for strings
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

        if (toChange === "SKU") {
            const skuErrorArray = updatedSizes.map((size, index) => {
                const isDuplicate = updatedSizes.some((otherSize, otherIndex) => otherSize.SKU === size.SKU && index !== otherIndex);
                return isDuplicate;
            });
            setSame(skuErrorArray);
        }

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


    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={`Edit Inventory: ${model} - ${colorway}`}
                centered
                size="auto"
            >
                {sizes.map((item, key) => (
                    <div className='flex flex-row' key={key}>
                        <div className='flex flex-col h-11 m-5'>
                            <p>SKU</p>
                            <TextInput
                                value={item.SKU}
                                disabled={editable}
                                onChange={(e) => handleChangeString(e, key, "SKU")}
                                error={same[key] ? "SKU must be unique" : ""}
                                withErrorStyles={same[key]}
                            />
                        </div>

                        <div className='flex flex-col m-5'>
                            <p>Size</p>
                            <TextInput
                                value={item.size}
                                onChange={(e) => handleChangeString(e, key, "size")}
                            />
                        </div>

                        <div className='flex flex-col m-5'>
                            <p>Price</p>
                            <NumberInput
                                value={item.price}
                                onChange={(e) => handleChangeNumber(e, key, "price")}
                                error={invalidPrice[key] ? "Price is not a valid number" : ""}
                                withErrorStyles={invalidPrice[key]}
                            />
                        </div>

                        <div className='flex flex-col m-5'>
                            <p>Stock</p>
                            <NumberInput
                                value={item.stock}
                                onChange={(e) => handleChangeNumber(e, key, "stock")}
                                error={invalidStock[key] ? "Stock is not a valid number" : ""}
                                withErrorStyles={invalidStock[key]}
                            />
                        </div>

                        <ImageUpload />
                    </div>
                ))}
            </Modal>

            <div className='w-[19rem] h-[31rem] border-solid border-2 rounded-lg border-black mx-10 my-10 px-5 py-12'>
                <div className='flex flex-row w-full'>
                    <div className='w-[100px] h-[100px] mr-5'>
                        <Image
                            radius="md"
                            src={sizes[0].image_link}
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

                        <div className='flex flex-row items-start justify-start'>
                            <PencilSquareIcon className="h-5 w-5 text-[#38bdba] mr-3" />
                            <p className='text-[#38bdba] text-sm'>Edit Image</p>
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