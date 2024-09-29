'use client'
import { CardProduct, Product } from '@/types/types';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, TextInput, NumberInput, Button } from '@mantine/core';

type CardProps = {
    product: Product
}

export default function CardStatus({product}: CardProps) {
    return(
        <div className="flex flex-col w-[13rem] h-[28rem] bg-indigo-300 m-11 items-center justify-center">
            <div className='w-28 h-28 p-5 bg-white'>
                <p>Image here</p>
            </div>
            <p>SKU: {product.SKU}</p>
            <p>size: {product.Size}</p>
            <p>brand: {product.Brand}</p>
            <p>model: {product.Model}</p>
            <p>price: {product.Price}</p>
            <p>stock: {product.Stock}</p>
            <p>colorway: {product.Colorway}</p>
        </div>
    );
}