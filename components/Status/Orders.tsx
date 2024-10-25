'use client'
import { useForm } from '@mantine/form';
import { TextInput, Button, NumberInput, FileButton, Tooltip, FloatingIndicator, Tabs, Image, Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CardProduct, GroupedProduct, OrderHistory, Product, ProductsOrdered } from '@/types/types';
import { Notifications, showNotification } from '@mantine/notifications';
import Papa from 'papaparse';
import SearchBar from '../SearchBar';
import { Epilogue } from 'next/font/google';
import styles from '../css/searchbar.module.css';
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import StatusCard from './StatusCard';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

const status = [
    "All",
    "Order Placed",
    "Awaiting Payment",
    "Paid",
    "Order Approved",
    "In Transit",
    "Completed",
    "Cancelled"
]


export default function AdminStock() {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [orderIds, setOrderIds] = useState<string[]>([]);
    const [orderProducts, setOrderProducts] = useState<ProductsOrdered[]>();
    const [selectedStatus, setSelectedStatus] = useState<string | null>(status[0]);
    const [sortedProducts, setSortedProducts] = useState<ProductsOrdered[]>();
    const [statusHistory, setStatusHistory] = useState<OrderHistory>({
        history_id: 0,
        order_id: "",
        order_status: {
            id: 0,
            status: ""
        },
        updated_at: new Date()
    });
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };

    const [pending, setPending] = useState(0);
    const [toShip, setToShip] = useState(0);
    const [inTransit, setInTransit] = useState(0);

    const handleNotification = () => {
        showNotification({
            title: 'Successfully submitted!',
            message: 'The products have been successfully submitted.',
        });
    };

    useEffect(() => {
        const getOrder = async () => {
            const response = await fetch('/api/orders/get_orders', {
                method: "GET"
            })

            const result = await response.json();
            console.log(result.order);
            const orders = Array.from(new Set(result.order));
            setOrderIds(orders as string[]);
        }
        getOrder();
    }, []);

    useEffect(() => {
        const selectId = async () => {
            const response = await fetch('/api/orders/get_from_id', {
                method: "POST",
                body: JSON.stringify(orderIds)
            })

            const result = await response.json()
            console.log(result.orders);
            setOrderProducts(result.orders);
        }
        selectId();
    }, [orderIds]);

    const editStatus = (status: OrderHistory, order: ProductsOrdered) => {
        const updatedHistory = [...order.status_history, status];

        const updatedProduct: ProductsOrdered = {
            ...order,
            status_history: updatedHistory
        };

        const updatedOrderProducts = orderProducts?.map((o) =>
            o.id === order.id ? updatedProduct : o
        );

        setOrderProducts(updatedOrderProducts);
    }

    const confirmStatus = async () => {
        const response = await fetch('/api/orders/change_status', {
            method: "POST",
            body: JSON.stringify({orderProducts})
        })

        const result = await response.json()
        
        if (result) {
            handleNotification();
        }
    }

    const handleStatusChange = (value: string | null) => {
        setSelectedStatus(value);
    }

    useEffect(() => {
        const tempArr: ProductsOrdered[] = [];
        if (orderProducts && selectedStatus != "All") {
            orderProducts.forEach(order => {
                const historyCount = order.status_history.length;
                if (selectedStatus ===  order.status_history[historyCount - 1].order_status.status) {
                    tempArr.push(order);
                }
            });
            setSortedProducts(tempArr);
        } else if (orderProducts && selectedStatus == "All") {
            setSortedProducts(orderProducts);
        }
       
    }, [selectedStatus, orderProducts])
    
    useEffect(() => {
        let tempPending = 0;
        let tempToShip = 0;
        let tempInTransit = 0;

        orderProducts?.forEach(order => {
            const historyCount = order.status_history.length;
            if (order.status_history[historyCount - 1].order_status.status == "Order Placed" || order.status_history[historyCount - 1].order_status.status == "Awaiting Payment" || order.status_history[historyCount - 1].order_status.status == "Paid") {
                tempPending += 1;
            } else if (order.status_history[historyCount - 1].order_status.status == "Order Approved") {
                tempToShip += 1;
            } else if (order.status_history[historyCount - 1].order_status.status == "In Transit") {
                tempInTransit += 1;
            }
        })

        setPending(tempPending);
        setToShip(tempToShip);
        setInTransit(tempInTransit);
    }, [orderProducts]);

    return (
        <div className="relative z-50 mb-[18rem] bg-white overflow-hidden flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
            <div className='flex flex-row items-center justify-end w-full'>
                <SearchBar />
            </div>

            <div className='flex flex-row items-center justify-between w-full'>
                <div className='flex flex-col items-start justify-start'>
                    <p style={epilogue.style} className="text-[72px] font-bold">Orders</p>
                    <Select
                        data={status}
                        defaultValue={selectedStatus}
                        onChange={handleStatusChange}
                        allowDeselect={false}
                        classNames={{
                            wrapper: styles.inputWrapper,
                            input: styles.input,
                        }}
                        rightSectionPointerEvents="none"
                        rightSection={<ChevronDownIcon className="h-6 w-6 text-black" />}
                    />
                </div>

                <div className='flex flex-row items-center mt-[5rem] w-[43vw] justify-between'>
                    <div className='w-[13vw] h-[14vh] p-2 bg-[#FBC02D33] rounded-lg flex flex-row items-start justify-start'>
                        <Image
                            src="/clock.svg"
                            h={50}
                            w="auto"
                            fit="contain"
                            fallbackSrc="/placeholder.svg"
                            className='mr-4 mt-1'
                        />
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#FBC02D]">{pending}</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#FBC02D]">Pending</p>
                        </div>
                    </div>

                    <div className='w-[13vw] h-[14vh] p-2 bg-[#38BDBA33] rounded-lg flex flex-row items-start justify-start'>
                        <Image
                            src="/clock blue.svg"
                            h={50}
                            w="auto"
                            fit="contain"
                            fallbackSrc="/placeholder.svg"
                            className='mr-4 mt-1'
                        />
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#38BDBA]">{toShip}</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#38BDBA]">To Ship</p>
                        </div>
                    </div>

                    <div className='w-[13vw] h-[14vh] p-2 bg-[#4747474D] rounded-lg flex flex-row items-start justify-start'>
                        <Image
                            src="/clock gray.svg"
                            h={50}
                            w="auto"
                            fit="contain"
                            fallbackSrc="/placeholder.svg"
                            className='mr-4 mt-1'
                        />
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#474747]">{inTransit}</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#474747]">In Transit</p>
                        </div>
                    </div>
                </div>

            </div>

            {sortedProducts?.map((order, index) => (
                <StatusCard key={index} orderedProducts={order} onChange={(e) => editStatus(e, order)} statusHistory={statusHistory} />
            ))}

            <Button className='mt-8'
                onClick={confirmStatus}
                styles={{
                    root: {
                        backgroundColor: "#38BDBA",
                        color: "white",
                        width: '10vw',
                    }
                }}
            >
                Save Order Status
            </Button>
            <Notifications></Notifications>

        </div>
    );
}
