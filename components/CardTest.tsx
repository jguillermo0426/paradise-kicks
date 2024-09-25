'use client'
import { Product } from '@/types/types';

type CardTestProps = {
    item: Product;
}

export default function CardTest({item}: CardTestProps) {
    return(
        <div className="flex flex-col w-48 h-96 bg-indigo-300 m-11 items-center justify-center">
            <div className='w-28 h-28 p-5 bg-white'>
                <p>Image here</p>
            </div>
            <div className='flex flex-col items-start justify-start w-full p-5'>
                <p>{item.sku}</p>
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.vendor}</p>
                <p>{item.stock}</p>
                <p>{item.price}</p>
                <p>{item.size}</p>
                <p>{item.colorway}</p>
            </div>
        </div>
    );
}