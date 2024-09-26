'use client'
import { CardProduct, GroupedProduct, Size } from '@/types/types';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, TextInput, NumberInput } from '@mantine/core';

type CardTestProps = {
    product: string;
    brand: string;
    colorway: string;
    sizes: Size[];
    onChange: (updatedProduct: CardProduct) => void;
}


export default function CardTest({product, brand, colorway, sizes, onChange}: CardTestProps) {

    const tempSizes = sizes;
    const tempProduct: CardProduct = {
        model: product,
        brand: brand,
        colorway: colorway,
        sizes: tempSizes
    }

    const [totalStock, setTotalStock] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);
    const [editedSizes, setEditedSizes] = useState<CardProduct>(tempProduct);

    
    useEffect(() => {
        let tempStock = 0;
        sizes.forEach((size) => {
            tempStock += Number(size.stock);
        });
        setTotalStock(tempStock);
    });
    
    // handles changing the value of the field for numbers
    const handleChangeNumber = (e: string | number, index: number, toChange: string) => {
        const updatedSizes = [...editedSizes.sizes];
        
        const updatedShoe = updateShoe(updatedSizes, index, e, toChange);

        console.log(e);
        setEditedSizes({
            ...editedSizes,
            sizes: updatedShoe
        });

        onChange({...editedSizes, sizes: updatedSizes})
    }

    const updateShoe = (updatedSizes: Size[], index: number, value: string | number, toChange: string) => {
        if (toChange === "stock") {
           const newStock = Number(value);

            updatedSizes[index] = {
                ...updatedSizes[index],
                stock: newStock
            }

        }

        else if (toChange === "price") {
            const newPrice = Number(value);
 
            updatedSizes[index] = {
             ...updatedSizes[index],
             price: newPrice
            }
 
         }
        return updatedSizes;
    }
    
    // handles changing the value of the field for strings
    const handleChangeString = (e: ChangeEvent<HTMLInputElement>, index: number, toChange: string) => {
        const updatedSizes = [...editedSizes.sizes];
        
        const updatedShoe = updateShoeString(updatedSizes, index, e.target.value, toChange);

        setEditedSizes({
            ...editedSizes,
            sizes: updatedShoe
        });

        onChange({...editedSizes, sizes: updatedSizes})
    }

    const updateShoeString = (updatedSizes: Size[], index: number, value: string, toChange: string) => {
        if (toChange === "size") {
            updatedSizes[index] = {
                ...updatedSizes[index],
                size: value
            }

        }
        
        else if (toChange === "sku") {
            updatedSizes[index] = {
                ...updatedSizes[index],
                SKU: value
            }

        }        
        return updatedSizes;
    }
    

    return(
        <>
            <Modal 
                opened={opened} 
                onClose={close} 
                title={`Edit Inventory: ${product} - ${colorway}`}
                centered
                size="auto"
            >
                {sizes.map((item, key) => (
                    <div className='flex flex-row' key={key}>
                        <div className='flex flex-col m-5'>
                            <p>SKU</p>
                            <TextInput 
                                value={item.SKU}
                                onChange={(e) => handleChangeString(e, key, "sku")}
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
                            />
                        </div>

                        <div className='flex flex-col m-5'>
                            <p>Stock</p>
                            <NumberInput 
                                value={item.stock}
                                onChange={(e) => handleChangeNumber(e, key, "stock")}
                            />
                        </div>
                    </div>
                ))}
            </Modal>
            
            <div className="flex flex-col w-48 h-96 bg-indigo-300 m-11 items-center justify-center" onClick={open}>
                <div className='w-28 h-28 p-5 bg-white'>
                    <p>Image here</p>
                </div>
                <div className='flex flex-col items-start justify-start w-full p-5'>
                <p>Name: {product}</p>
                <p>Brand: {brand}</p>
                <p>Colorway: {colorway}</p>
                <p>Total stock: {totalStock}</p>
                </div>
            </div>
        </>
    );
}