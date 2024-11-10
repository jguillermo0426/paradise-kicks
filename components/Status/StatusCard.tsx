'use client'
import { OrderHistory, Product, ProductsOrdered } from '@/types/types';
import styles from '../css/searchbar.module.css';
import { Image, Select } from '@mantine/core';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Epilogue } from 'next/font/google';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})


const status = [
    "Order Placed",
    "In Transit",
    "Awaiting Payment",
    "Completed",
    "Cancelled",
    "Order Approved",
    "Paid",
]

type StatusProps = {
    orderedProducts: ProductsOrdered;
    onChange: (status: OrderHistory) => void;
    statusHistory: OrderHistory;
}

export default function StatusCard({ orderedProducts, onChange }: StatusProps) {
    const [latestStatus, setLatestStatus] = useState<string>("");
    const [totalQty, setTotalQty] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        const historyCount = orderedProducts.status_history.length;
        setLatestStatus(orderedProducts.status_history[historyCount - 1].order_status.status)

        var qty = 0;
        var price = 0;
        orderedProducts.products_ordered.forEach(product => {
            qty += product.quantity;
            price += product.product_id.Price;
        });


        setTotalQty(qty);
        setTotalPrice(price);
    }, [orderedProducts]);

    const findLatest = (orderStatus: string) => {
        return orderStatus === latestStatus;
    }

    const handleStatusChange = (value: string | null) => {
        if (value) {
            console.log("Selected status:", value);
            setLatestStatus(value);
            const products = { ...orderedProducts };
            const orderId = products.id;

            const statusHistory = {
                history_id: 0,
                order_id: orderId,
                order_status: {
                    id: status.findIndex((s) => s === value),
                    status: value 
                },
                updated_at: new Date()
            };
            

            onChange(statusHistory);
        }
    };

    return (
        <>
            <Modal opened={opened} onClose={close} size="auto">
                <div className='p-10 flex flex-row'>
                    <Image
                        src={orderedProducts.products_ordered[0].product_id.image_link}
                        h={100}
                        w="auto"
                        fit="contain"
                    />

                    <div className='flex flex-col'>
                        <p>{orderedProducts.products_ordered[0].product_id.Model}</p>
                        <p>{orderedProducts.products_ordered[0].product_id.Colorway}</p>
                        <p>{orderedProducts.products_ordered[0].product_id.Size}</p>
                        <p>{orderedProducts.products_ordered[0].quantity}</p>
                    </div>
                </div>
            </Modal>

            <div className="w-full h-[19vh] rounded-lg my-5 p-10 flex flex-row items-start justify-between bg-[#EDEDED]">
                <Image
                    src="/kebab menu.svg"
                    h={30}
                    w="auto"
                    fit="contain"
                    onClick={open}
                />

                <Select
                    data={status}
                    size="xs"
                    value={latestStatus}
                    onChange={handleStatusChange}
                    allowDeselect={false}
                    classNames={{
                        wrapper: styles.inputWrapper,
                        input: styles.input,
                    }}
                    rightSectionPointerEvents="none"
                    className='w-36'
                    rightSection={<ChevronDownIcon className="h-6 w-6 text-black" />}
                />

                <div className='w-20 mr-5'>
                    <p style={epilogue.style} className="font-semibold text-[16px]">{orderedProducts.id}</p>
                </div>

                <div className='w-32 h-full flex flex-col justify-start'>
                    <p style={epilogue.style} className="font-semibold text-[16px]">Courier</p>
                    <p style={epilogue.style} className="font-normal text-[16px]">{orderedProducts.courier}</p>
                </div>

                <div className='w-40 h-full flex flex-col justify-start'>
                    <p style={epilogue.style} className="font-semibold text-[16px]">Payment Method</p>
                    <p style={epilogue.style} className="font-normal text-[16px]">{orderedProducts.payment_method}</p>
                </div>

                <div className='w-44 h-full flex flex-col justify-start'>
                    <p style={epilogue.style} className="font-semibold text-[16px]">Payment Term</p>
                    <p style={epilogue.style} className="font-normal text-[16px]">{orderedProducts.payment_terms.payment_term}</p>
                </div>

                <div className='w-32 h-full flex flex-col justify-start'>
                    <p style={epilogue.style} className="font-semibold text-[16px]">Quantity</p>
                    <p style={epilogue.style} className="font-normal text-[16px]">{totalQty}</p>
                </div>

                <div className='w-32 h-full flex flex-col justify-start'>
                    <p style={epilogue.style} className="font-semibold text-[16px]">Total Price</p>
                    <p style={epilogue.style} className="font-normal text-[16px]">{totalPrice}</p>
                </div>
            </div>
        </>
    );
}