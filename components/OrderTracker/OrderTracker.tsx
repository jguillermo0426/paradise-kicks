'use client'
import { OrderHistory } from '@/types/types';
import { Button, Input, MantineProvider, UnstyledButton } from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { Epilogue } from 'next/font/google';
import { useEffect, useState } from 'react';


const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})


export default function OrderTracker() {
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [orderStatusHistory, setOrderStatusHistory] = useState<OrderHistory[]>([]);

    const getOrderStatus = async () => {
        if (!orderNumber) {
            console.log("Order number is not set.");
            return;
        }
        
        const response = await fetch(`/api/orders/get_order_status?orderNumber=${orderNumber}`, {
            method: "GET"
        });

        const result = await response.json();

        if (result.statusHistory.length != 0) {
            setOrderStatusHistory(result.statusHistory);
            console.log("history: ", orderStatusHistory);
        }
        else {
            console.log("order number not found.");
            notifications.show({
                message: "Order number not found.",
                color: "red"
            });
            setOrderStatusHistory([]);
        }
    }

    useEffect(() => {
        getOrderStatus();
    }, []);


    const formatDate = (orderDate: Date) => {
        let formattedDate = "";

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const dateOrdered = new Date(orderDate);
        const month = months[dateOrdered.getMonth()];
        const day = (dateOrdered.getDate()).toString();
        const year = (dateOrdered.getFullYear()).toString();
        const time = dateOrdered.toLocaleTimeString();

        formattedDate = `${month} ${day}, ${year} - ${time}`

        return formattedDate;
    }


    const statusCircle = (<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="28.5" stroke="black" strokeWidth="3"/>
        <circle cx="30" cy="30" r="24" fill="#1C1C1C"/>
        </svg>
        )

    
    const emptyOrderNumber = () => {
        notifications.show({
            message: "Please provide an order number.",
            color: "yellow"
        });
    }
    

    return (
        <MantineProvider>
            <div className='p-20 flex flex-col items-center mx-4 mt-4 relative z-0 bg-white overflow-hidden min-h-screen'>
                <Notifications />
                <div className="max-[745px]:p-0 max-[745px]:m-0 mt-5 flex flex-col items-center justify-center w-full mb-20 px-20 py-10">
                    {/* RETURN BUTTON */}
                    <div className="mr-auto -mt-10 mb-12">
                        <Button
                            component="a"
                            href="/product-listing"
                            variant="filled"
                            fullWidth
                            color="black"
                            radius="md"
                            className="hover:outline hover:outline-offset-2 hover:outline-dark-gray shadow-lg"
                            styles={{
                                root: {
                                    height: "46px",
                                    width: "150px"
                                },
                                label: {
                                    fontFamily: "Epilogue",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    color: "#EDEDED"
                                }
                            }}
                        >
                            Return
                        </Button>
                    </div>
                    {/* ORDER TRACKER */}
                    <div className="max-[1146px]:flex-col max-[1146px]:gap-x-0 max-[1146px]:gap-y-20 flex flex-row items-start justify-center w-full gap-x-40">
                        {/* LEFT SIDE */}
                        <div className="max-[709px]:w-full max-[1146px]:w-full flex flex-col items-start w-[55%] mt-16">
                            <p className="max-[709px]:text-[52px] max-[842px]:text-[62px] leading-none text-[72px] font-bold mb-[-22px] -tracking-[0.025em]" style={epilogue.style}>
                                Order Tracker
                            </p>
                            <p className="max-[709px]:text-[20px] text-[24px] mb-14 mt-5" style={epilogue.style}>
                                Check your order status here.
                            </p>
                            <p className="text-[20px] text-[#7F7F7F] -tracking-[0.025em]" style={epilogue.style}>
                                Order Number
                            </p>
                            <div className="mb-16">
                                <Input 
                                    className="w-[425px] max-[559px]:h-[40px] max-[559px]:w-[355px]"
                                    value={orderNumber}
                                    onChange={(event) => setOrderNumber(event.currentTarget.value)}
                                    size="xl" 
                                    radius="md"
                                    styles={{
                                        input: {
                                            border: "1px solid #474747",
                                            fontFamily: "Epilogue"
                                        }
                                    }}
                                />
                            </div> 

                            <UnstyledButton 
                                onClick={() => {
                                    if (orderNumber === "") {
                                        emptyOrderNumber();
                                    } else {
                                        getOrderStatus();
                                    }
                                }}
                            >
                                <div className="max-[559px]:w-[355px] flex flex-col items-center justify-center w-[430px] h-[78px] bg-[#177F7D] rounded-md
                                                hover:outline hover:outline-offset-2 hover:outline-[#177F7D] shadow-lg">
                                    <p className="text-[24px] text-[#EDEDED] font-semibold -tracking-[0.025em]" style={epilogue.style}>
                                        Track Order
                                    </p>
                                </div>  
                            </UnstyledButton>
                        </div>
                        
                        {/* RIGHT SIDE */}
                        <div className="max-[1146px]:w-full flex flex-col items-start justify-end w-[45%]">
                            <div className="flex flex-col items-end justify-end ml-auto mb-12 py-4 border-r-[3px] border-[#D7D7D7]">
                                <p className="leading-none text-[32px] max-[1192px]:text-[28px] font-bold mr-6 text-right -tracking-[0.025em]" style={epilogue.style}>
                                    Order Status
                                </p>
                                {orderStatusHistory?.length != 0 && (
                                    <p className="max-[1192px]:text-[18px] text-[24px] mr-6 -tracking-[0.025em]" style={epilogue.style}>
                                        {orderStatusHistory[0].order_id}
                                    </p>
                                )}
                            </div>
                            {/* STATUS HISTORY */}
                            <div className="flex flex-col items-start">
                                {orderStatusHistory &&
                                    orderStatusHistory.map((status, statusIndex) => (
                                        <div key={statusIndex} className='flex flex-row items-end'>
                                            {/* CIRCLE & LINE */}
                                            <div className='flex flex-col items-center mr-6'>
                                                {statusIndex === 0 ? (
                                                    statusCircle
                                                ) : (
                                                    <>
                                                        <div className='w-[2px] w-[4px] h-[120px]'></div>
                                                        {statusCircle}
                                                    </>
                                                )}
                                                
                                            </div>
                                            {/* STATUS & DATETIME */}
                                            <div className="flex-col">
                                                <p className="max-[1192px]:text-[20px] text-[24px] font-bold mb-[-5px] -tracking-[0.025em]" style={epilogue.style}>
                                                    {status.order_status.status}
                                                </p>
                                                <p className="text-[16px] text-[#7F7F7F] -tracking-[0.025em]" style={epilogue.style}>
                                                    {formatDate(status.updated_at)}
                                                </p>
                                            </div>
                                        </div>  
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </MantineProvider>
    );
}
