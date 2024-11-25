'use client'

import { ProductsOrdered } from "@/types/types";
import { Button, Divider, Image, SimpleGrid, Table } from "@mantine/core";
import { Epilogue } from 'next/font/google';
import { useEffect, useState } from "react";
import styles from "../css/table.module.css"
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { useCart } from '@/utils/useCart';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

export default function OrderSlip({ orderslipid }: { orderslipid: string }) {
    const { clearCart } = useCart();
    const [order, setOrder] = useState<ProductsOrdered>();
    const [date, setDate] = useState<string>();
    const [fee, setFee] = useState<number>(0);

    useEffect(() => {
        const getOrder = async () => {
            const response = await fetch(`/api/orders/get_from_id`, {
                method: "POST",
                body: JSON.stringify([orderslipid])
            })

            const result = await response.json();
            console.log(result.orders);
            setOrder(result.orders[0]);
        }
        getOrder();
        clearCart();
    }, [orderslipid]);

    useEffect(() => {
        if (order?.payment_terms.id == 4) {
            setFee(0);
        }
        else if (order?.payment_terms.id == 3) {
            setFee(250);
        }
        else {
            setFee(99);
        }
    }, [order])

    useEffect(() => {
        if (order?.time_ordered) {
            const timeOrdered = new Date(order.time_ordered); // Convert to Date if it's a string
            if (!isNaN(timeOrdered.getTime())) { // Check if it's a valid Date
                setDate(timeOrdered.toLocaleDateString("en-US"));
            } else {
                console.error('Invalid time_ordered value');
            }
        }
    }, [order]);

    const scale = 2;
    const fileSave = async () => {
        const orderSlipElement = document.getElementById('order-slip');
        if (orderSlipElement) {
            domtoimage.toBlob(orderSlipElement, {
                width: orderSlipElement.clientWidth * scale,
                height: orderSlipElement.clientHeight * scale,
                style: {
                    transform: 'scale(' + scale + ')',
                    transformOrigin: 'top left',
                    width: orderSlipElement.clientWidth + 'px',
                    height: orderSlipElement.clientHeight + 'px'
                }
            })
                .then(function (blob) {
                    const filename = `Order Slip_${orderslipid}.png`
                    saveAs(blob, filename);
                })
                .catch(function (error) {
                    console.error('Error generating image:', error);
                });
        } else {
            console.error('Element with ID "order-slip" not found');
        }
    }

    return (
        <div className="flex flex-col items-start m-20 relative z-50 mb-[18rem] bg-white overflow-x-hidden min-h-screen">
            <Button
                component="a"
                href="/"
                variant="filled"
                fullWidth
                color="black"
                radius="md"
                styles={{
                    root: {
                        height: "46px",
                        width: "207px",
                        marginRight: "auto",
                        marginBottom: "40px"
                    },
                    label: {
                        fontFamily: "Epilogue",
                        fontWeight: 700,
                        fontSize: "20px",
                        color: "#EDEDED"
                    }
                }}
            >
                Return
            </Button>

            <p style={epilogue.style} className="text-[4.5rem] font-bold">Order Invoice</p>

            <div className="flex flex-row w-full justify-between">
                <div id="order-slip" className="flex flex-col p-8 bg-white h-fit w-[48.503vw] 3xl:w-[38.802vw] 3xl:h-[72.315vh] mb-12 rounded-lg border-[1px] border-[#1C1C1C80]">
                    <div className="flex flex-row justify-between">
                        <p style={epilogue.style} className="text-[2.5rem] font-bold mt-16">ORDER INVOICE</p>
                        <Image
                            src="/logo invoice.png"
                            w={250}
                            fit="contain"
                        />
                    </div>
                    <SimpleGrid cols={3} className="mt-16">
                        <div className="flex flex-col">
                            <p style={epilogue.style} className="text-[0.625rem] font-semibold mb-4 text-[#1C1C1C66]">SHIP TO</p>
                            <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.customer_name}</p>
                            <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.email}</p>
                            <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.contact_no}</p>
                        </div>
                        <div className="flex flex-col w-[10.156vw] 3xl:w-[8.125vw]">
                            <p style={epilogue.style} className="text-[0.625rem] font-semibold mb-4 text-[#1C1C1C66]">SHIPPING ADDRESS</p>
                            <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.address}</p>
                        </div>
                        <div className="flex flex-col">
                            <SimpleGrid cols={2}>
                                <p style={epilogue.style} className="text-[0.625rem] font-semibold text-[#1C1C1C66]">ORDER NUMBER</p>
                                <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.id}</p>
                                <p style={epilogue.style} className="text-[0.625rem] font-semibold text-[#1C1C1C66]">ORDER DATE</p>
                                <p style={epilogue.style} className="text-[0.625rem] font-normal">{date}</p>
                            </SimpleGrid>
                        </div>
                    </SimpleGrid>
                    <SimpleGrid cols={3} className="mt-16">
                        <div className="flex flex-col">
                            <p style={epilogue.style} className="text-[0.625rem] font-semibold mb-4 text-[#1C1C1C66]">PAYMENT METHOD</p>
                            <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.payment_method}</p>
                            <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.payment_terms.payment_term}</p>
                        </div>
                        <div className="flex flex-col w-[10.156vw] 3xl:w-[8.125vw]">
                            <p style={epilogue.style} className="text-[0.625rem] font-semibold mb-4 text-[#1C1C1C66]">COURIER DETAILS</p>
                            <p style={epilogue.style} className="text-[0.625rem] font-normal">{order?.courier}</p>
                        </div>
                        <div className="flex flex-col">
                            <p style={epilogue.style} className="text-[0.625rem] font-semibold mb-4 text-[#1C1C1C66]">TOTAL AMOUNT TO PAY</p>
                            <p style={epilogue.style} className="text-[2rem] font-semibold">&#8369; {order?.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </SimpleGrid>
                    <Table withTableBorder withColumnBorders
                        className="rounded-xl"
                        borderColor="black"
                        style={epilogue.style}
                        classNames={{
                            thead: styles.header,
                            table: styles.table
                        }}
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Model</Table.Th>
                                <Table.Th>Colorway</Table.Th>
                                <Table.Th>Size</Table.Th>
                                <Table.Th>Qty</Table.Th>
                                <Table.Th>Price</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        {
                            order?.products_ordered.map((product, index) => (
                                <Table.Tbody key={index}>
                                    <Table.Tr>
                                        <Table.Td>{`${product.product_id.Brand} ${product.product_id.Model}`}</Table.Td>
                                        <Table.Td>{product.product_id.Colorway}</Table.Td>
                                        <Table.Td>{product.product_id.Size}</Table.Td>
                                        <Table.Td>{product.quantity}</Table.Td>
                                        <Table.Td className={styles.price}>&#8369; {(product.product_id.Price * product.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            ))
                        }
                    </Table>
                    <div className="flex w-full items-end justify-end">
                        <div className="flex flex-col w-[17.578vw] h-auto px-5 py-2 3xl:w-[14.063vw] 3xl:h-auto bg-[#EDEDED] border-r-[1px] border-l-[1px] border-b-[1px] border-black">
                            <SimpleGrid cols={2}>
                                <p style={epilogue.style} className="text-[0.625rem] font-semibold m-0">SHIPPING FEE</p>
                                <p style={epilogue.style} className="text-[0.625rem] font-semibold m-0">&#8369; {fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <p style={epilogue.style} className="text-[0.625rem] font-semibold m-0">TOTAL</p>
                                <p style={epilogue.style} className="text-[0.625rem] font-semibold m-0">&#8369; {order?.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </SimpleGrid>
                        </div>
                    </div>
                    <div className="flex flex-col w-full my-8 p-3 rounded-md border-[1px] border-[#1C1C1C80]">
                        <p style={epilogue.style} className="text-[0.625rem] font-bold mb-4 text-[#1C1C1C80]">ADDITIONAL NOTES</p>
                        <p style={epilogue.style} className="text-[0.625rem] font-normal mb-4">{order?.notes}</p>
                    </div>
                </div>

                <div className="flex flex-col ml-12">
                    <p style={epilogue.style} className="text-[2rem] font-bold mb-20">Order Confirmation Guidelines</p>
                    <p style={epilogue.style} className="text-[1.5rem] font-bold text-[#474747]">Step 1  :  <span className="text-[1.5rem] font-normal text-[#474747]">Download the Order Invoice</span></p>
                    <Button
                        variant="filled"
                        fullWidth
                        color="black"
                        radius="md"
                        onClick={fileSave}
                        styles={{
                            root: {
                                height: "7.222vh",
                                marginRight: "auto",
                                marginBottom: "40px"
                            },
                            label: {
                                fontFamily: "Epilogue",
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                color: "#EDEDED"
                            }
                        }}
                    >
                        Download
                    </Button>

                    <Divider orientation='horizontal' className='w-full my-3 border-[#B1B1B180]' />

                    <p style={epilogue.style} className="text-[1.5rem] font-bold text-[#474747] my-[40px]">Step 2  :  <span className="text-[1.5rem] font-normal text-[#474747]">Send Invoice to Facebook or Viber</span></p>

                    <div className="flex flex-row justify-between">
                        <Image
                            src="/Facebook.png"
                            w={270}
                            fit="contain"
                        />
                        <Image
                            src="/Viber.png"
                            w={270}
                            fit="contain"
                            className="ml-4"
                        />
                    </div>

                    <p style={epilogue.style} className="text-[1.25rem] mt-[40px] font-normal text-[#474747B3]">Important Note:</p>
                    <div className="bg-[#FBC02D33] 2xl:h-[12.5vh] 3xl:h-[10vh] rounded-lg flex flex-row p-5 items-center justify-center mb-12">
                        <Image
                            src="/warning.svg"
                        />
                        <p className="mx-6" style={epilogue.style}>The <span style={epilogue.style} className="font-semibold">generated invoice slip should be sent to our Facebook Page or Viber.</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}