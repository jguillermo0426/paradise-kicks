'use client'
import { Size } from '@/types/types';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

type CardTestProps = {
    product: string;
    brand: string;
    colorway: string;
    sizes: Size[];
}

export default function CardTest({product, brand, colorway, sizes}: CardTestProps) {

    const [totalStock, setTotalStock] = useState(0);
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        let tempStock = 0;
        sizes.forEach((size) => {
            tempStock += Number(size.stock);
        });
        setTotalStock(tempStock);
    });

    return(
        <>
            <Modal 
                opened={opened} 
                onClose={close} 
                title={`Edit Inventory: ${product} - ${colorway}`}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                centered
            >
                {sizes.map((item, key) => (
                    <div className='flex flex-row' key={key}>
                        <div className='flex flex-col m-5'>
                            <p>Size</p>
                            <p>{item.size}</p>
                        </div>

                        <div className='flex flex-col m-5'>
                            <p>Price</p>
                            <p>{item.price}</p>
                        </div>

                        <div className='flex flex-col m-5'>
                            <p>Stock</p>
                            <p>{item.stock}</p>
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