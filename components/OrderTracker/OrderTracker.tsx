'use client'
import { Button, MantineProvider, Input, UnstyledButton } from '@mantine/core';
import React from 'react';
import { useEffect, useState } from 'react';
import { OrderHistory } from '@/types/types'


export default function OrderTracker() {
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const getOrderStatus = async () => {

        const response = await fetch(`/api/orders/get_order_status?orderNumber=${orderNumber}`, {
            method: "GET"
        });
    }
    

    return (
        <MantineProvider>
            <div className='flex flex-col items-center m-4 relative z-50 mb-[18rem] bg-white overflow-hidden min-h-screen'>
                <div className="ml-[55px] mt-10 mr-auto">
                    <Button
                        component="a"
                        href="/product-listing"
                        variant="filled"
                        fullWidth
                        color="black"
                        radius="md"
                        styles={{
                            root: {
                                height: "46px",
                                width: "207px"
                            },
                            label: {
                                fontFamily: "Epilogue",
                                fontSize: "20px",
                                color: "#EDEDED"
                            }
                        }}
                    >
                        Return
                    </Button>
                </div>

                <div className="flex flex-col items-center w-full max-w-[1440px] m-6">
                    <div className="flex flex-row items-center justify-center w-full">
                        <div className="flex flex-col items-start w-[60%]">
                            <p className="text-[72px]" style={{ fontFamily: "EpilogueBold", letterSpacing: -1, marginBottom: "-20px" }}>
                                Order Tracker
                            </p>
                            <p className="text-[24px] mb-16" style={{ fontFamily: "Epilogue", letterSpacing: -1 }}>
                                Check you order status here.
                            </p>
                            <p className="text-[20px]" style={{ fontFamily: "Epilogue", color: "#7F7F7F", letterSpacing: -1 }}>
                                Order Number
                            </p>
                            <Input 
                            className="w-[425px]"
                            placeholder="Order Number"
                            value={orderNumber}
                            onChange={(event) => setOrderNumber(event.currentTarget.value)}
                            size="xl" 
                            radius="md"
                            styles={{
                                input: {
                                    border: "1px solid black",
                                    fontFamily: "Epilogue"
                                }
                            }}
                            />
                            <p className="text-[20px] mt-8" style={{ fontFamily: "Epilogue", color: "#7F7F7F", letterSpacing: -1 }}>
                                Billing Last Name
                            </p>
                            <Input 
                            className="w-[425px]"
                            placeholder="Billing Last Name"
                            value={lastName}
                            onChange={(event) => setLastName(event.currentTarget.value)}
                            size="xl" 
                            radius="md"
                            styles={{
                                input: {
                                    border: "1px solid black",
                                    fontFamily: "Epilogue"
                                }
                            }}
                            />
                            <UnstyledButton onClick={() => getOrderStatus()}>
                                <div className="flex flex-col items-center justify-center w-[430px] h-[78px] mt-16 bg-black rounded-md">
                                    <p className="text-[24px]" style={{ fontFamily: "EpilogueSemiBold", color: "#EDEDED" }}>
                                        Track Order
                                    </p>
                                </div>  
                            </UnstyledButton>
                        </div>

                        <div className="flex flex-col items-start justify-start w-[40%]">
                            <div className="flex flex-col items-end ml-auto py-4 border-r-[3px] border-[#D7D7D7]">
                                <p className="text-[32px] mr-6" style={{ fontFamily: "EpilogueBold", letterSpacing: -1, marginBottom: "-10px" }}>
                                    Order Status
                                </p>
                                <p className="text-[24px] mr-6" style={{ fontFamily: "Epilogue", letterSpacing: -1 }}>
                                    12345678
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </MantineProvider>
    );
}
