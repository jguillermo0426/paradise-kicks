'use client'
import { useForm } from '@mantine/form';
import { TextInput, Button, NumberInput, FileButton, Tooltip, FloatingIndicator, Tabs, Image, Select, Pagination } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { CardProduct, GroupedProduct, OrderHistory, Product, ProductsOrdered } from '@/types/types';
import { Notifications, showNotification } from '@mantine/notifications';
import SearchBar from '../SearchBar';
import { Epilogue } from 'next/font/google';
import styles from '../css/searchbar.module.css';
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import StatusCard from './StatusCard';
import classes from '../css/tabs.module.css';

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
    const [activePage, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchValue, setSearchValue] = useState<string>('');
    const [pending, setPending] = useState(0);
    const [toShip, setToShip] = useState(0);
    const [inTransit, setInTransit] = useState(0);

    const handleNotification = () => {
        showNotification({
            title: 'Successfully submitted!',
            message: 'The products have been successfully submitted.',
        });
    };

    const handleSearchChange = useCallback((newSearchValue: string) => {
        setSearchValue(newSearchValue);
    }, []);

    useEffect(() => {
        const getOrder = async () => {
            const response = await fetch(`/api/orders/get_orders?page=${activePage}&order_id=${searchValue}`, {
                method: "GET"
            })

            const result = await response.json();
            console.log(result.order);
            const orders = Array.from(new Set(result.order));
            setOrderIds(orders as string[]);
        }
        getOrder();
    }, [activePage, searchValue]);

    useEffect(() => {
        const selectId = async () => {
            const response = await fetch(`/api/orders/get_from_id`, {
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
        const isStatusAlreadyAdded = order.status_history.some(
            (existingStatus) => existingStatus.history_id === status.history_id
        );

        if (isStatusAlreadyAdded) {
            console.log('Status already exists, skipping update.');
            return;
        }

        const updatedHistory = [...order.status_history, status];

        const updatedProduct: ProductsOrdered = {
            ...order,
            status_history: updatedHistory
        };

        const updatedOrderProducts = orderProducts?.map((o) =>
            o.id === order.id ? updatedProduct : o
        );

        console.log(updatedOrderProducts);
        setOrderProducts(updatedOrderProducts);
    };

    const confirmStatus = async () => {
        console.log(orderProducts);
        const response = await fetch('/api/orders/change_status', {
            method: "POST",
            body: JSON.stringify({ orderProducts })
        })

        const result = await response.json()
        if (result) {
            handleNotification();
            const fetchUpdatedOrders = await fetch(`/api/orders/get_from_id`, {
                method: 'POST',
                body: JSON.stringify(orderIds),
            });
            const updatedOrders = await fetchUpdatedOrders.json();
            setOrderProducts(updatedOrders.orders);
        }
    }

    const handleStatusChange = (value: string | null) => {
        setSelectedStatus(value);
    }

    useEffect(() => {
        setPage(1);
    }, [searchValue]);

    useEffect(() => {
        const tempArr: ProductsOrdered[] = [];
        if (orderProducts && selectedStatus != "All") {
            orderProducts.forEach(order => {
                const historyCount = order.status_history.length;
                if (selectedStatus === order.status_history[historyCount - 1].order_status.status) {
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
                <TextInput
                    classNames={{
                        wrapper: styles.inputWrapper,
                        input: styles.input,
                    }}
                    className="mx-4"
                    value={searchValue}
                    onChange={(event) => handleSearchChange(event.currentTarget.value)}
                    placeholder="Search"
                />
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
                        <div className="w-14 h-14 mr-4 ml-1">
                            <svg
                                data-slot="icon"
                                fill="none"
                                strokeWidth="1"
                                stroke="#38BDBA"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                                />
                            </svg>
                        </div>
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#38BDBA]">{toShip}</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#38BDBA]">To Ship</p>
                        </div>
                    </div>

                    <div className='w-[13vw] h-[14vh] p-2 bg-[#2E7D3133] rounded-lg flex flex-row items-start justify-start'>
                        <div className="w-14 h-14 mr-4 ml-1">
                            <svg
                                data-slot="icon"
                                fill="none"
                                strokeWidth="1"
                                stroke="#2E7D31"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                />
                            </svg>
                        </div>
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#2E7D31]">{inTransit}</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#2E7D31]">In Transit</p>
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

            <Pagination
                value={activePage}
                total={totalPages}
                onChange={(page) => {
                    {
                        setPage(page);
                        window.scrollTo(0, 0);
                    }
                }}
                className='my-5'
                classNames={{
                    root: classes.pageRoot
                }}
            />
            <Notifications></Notifications>

        </div>
    );
}
