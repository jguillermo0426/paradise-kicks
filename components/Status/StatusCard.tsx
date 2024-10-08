'use client'
import { Product, ProductsOrdered } from '@/types/types';
import styles from '../css/searchbar.module.css';
import { Image, Select } from '@mantine/core';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const status = [
    "Order Placed",
    "Awaiting Payment",
    "Paid",
    "Order Approved",
    "In Transit",
    "Completed",
    "Cancelled"
]

type StatusProps = {
    orderedProducts: ProductsOrdered
}

export default function StatusCard({orderedProducts}: StatusProps) {
    console.log(orderedProducts.order.status);
    return(
        <div className="w-full h-[19vh] rounded-lg my-5 p-10 flex flex-row items-center justify-between bg-[#EDEDED]">
            <Image
                src="/kebab menu.svg"
                h={30}
                w="auto"
                fit="contain"
            />

            <Select
                data={status}
                defaultValue={orderedProducts.order.status}
                allowDeselect={false}
                classNames={{
                    wrapper: styles.inputWrapper,
                    input: styles.input,
                }}
                rightSectionPointerEvents="none"
                rightSection={<ChevronDownIcon className="h-6 w-6 text-black" />}
            />
        </div>
    );
}