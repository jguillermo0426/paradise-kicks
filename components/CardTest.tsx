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
                <p>{item.SKU}</p>
                <p>{item.Model}</p>
                <p>{item.Brand}</p>
                <p>{item.Stock}</p>
                <p>{item.Price}</p>
                <p>{item.Size}</p>
            </div>
        </div>
    );
}