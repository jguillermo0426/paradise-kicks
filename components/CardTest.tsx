'use client'
import { CardProduct } from '@/types/types';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, TextInput, NumberInput, Button } from '@mantine/core';

type CardTestProps = {
    cardProduct: CardProduct;
    onChange: (updatedProduct: CardProduct) => void;
    editable: boolean;
    setHasErrors: Dispatch<SetStateAction<boolean>>;
}


export default function CardTest({cardProduct, onChange, editable, setHasErrors}: CardTestProps) {
    const { modelId, colorId, model, brand, colorway, sizes } = cardProduct;

    const [totalStock, setTotalStock] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);
    const [editedSizes, setEditedSizes] = useState({ modelId, colorId, model, brand, colorway, sizes });
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
        setEditedSizes({ modelId, colorId, model, brand, colorway, sizes });
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

        onChange({...editedSizes, sizes: updatedSizes})
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

        onChange({...editedSizes, sizes: updatedSizes});
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
    

    return(
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
                    </div>
                ))}
            </Modal>
            
            <div className="flex flex-col w-[13rem] h-[32rem] bg-indigo-300 m-11 items-center justify-center">
                <div className='w-28 h-28 p-5 bg-white'>
                    <p>Image here</p>
                </div>
                <div className='flex flex-col items-start justify-start w-full p-5'>
                <p>Model:</p>
                <TextInput 
                    value={editedSizes.model}
                    onChange={(e) => handleChangeCard(e, "model")}
                />
                <p>Brand:</p>
                <TextInput 
                    value={editedSizes.brand}
                    onChange={(e) => handleChangeCard(e, "brand")}
                />
                <p>Colorway:</p>
                <TextInput 
                    value={editedSizes.colorway}
                    onChange={(e) => handleChangeCard(e, "colorway")}
                />
                <p>Total stock: {totalStock}</p>
                </div>

                <Button variant="filled" onClick={open}>See Stock</Button>
            </div>
        </>
    );
}