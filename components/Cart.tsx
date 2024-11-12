'use client'
import { MantineProvider, Select, TextInput, Popover, Button, Pagination, LoadingOverlay, ActionIcon, UnstyledButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GroupedProduct2, Product, itemOrder } from '@/types/types';
import React from 'react';
import { Image } from "@nextui-org/image";
import { useCart } from '@/utils/useCart';
import '@mantine/notifications/styles.css';
import { notifications, Notifications } from '@mantine/notifications';
import { useRouter } from "next/navigation"; 


export default function Cart() {
    const { cart, removeFromCart, increaseCartItem, decreaseCartItem } = useCart();
    const [item, setItem] = useState<Product>();
    const [cartItems, setCartItems] = useState<itemOrder[]>([]);
    const router = useRouter();
    const brandLogoMap: Map<string, string> = new Map();

    brandLogoMap.set("Nike", "/nike.png");
    brandLogoMap.set("Adidas", "/adidas.png");
    brandLogoMap.set("New Balance", "/new balance.png");
    brandLogoMap.set("On", "/on.png");
    brandLogoMap.set("Puma", "/puma.png");

    const removeItem = (itemSKU: string) => {
        removeFromCart(itemSKU);
    }

    const increaseQuantity = (item: itemOrder) => {
        let newQuantity = item.quantity + 1;

        if (newQuantity <= item.product.Stock) {
            increaseCartItem(item.sku);
        } else {
            notifications.show({
                message: "You have reached the maximum quantity for this item.",
                color: "red"
            });
        } 
    };

    const decreaseQuantity = (item: itemOrder) => {
        decreaseCartItem(item.sku);        
    };

    useEffect(() => {
        console.log("cart", cart);
    }, [cart]);

    const getTotalPrice = () => {
        let totalPrice = 0;

        cart.map((item) => {
            totalPrice += (item.product.Price * item.quantity);
        })

        return totalPrice;
    }

    const getTotalQuantity = () => {
        let totalQuantity = 0;

        cart.map((item) => {
            totalQuantity += item.quantity;
        })

        return totalQuantity;
    }


    return (
        <MantineProvider>
            <div className="flex flex-col items-center m-20 relative z-50 mb-[18rem] bg-white overflow-x-hidden min-h-screen">
                <div className="flex flex-col items-center justify-center w-full max-w-[1440px] m-6">
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

                    {/* MY CART */}
                    <div className="w-full flex flex-col items-start justify-start mb-10">
                        <p className="text-[72px]" style={{ fontFamily: "EpilogueBold", letterSpacing: "-1px", marginRight: "auto" }}>
                            My Cart
                        </p>
                        <Notifications />
                        <div className="w-full flex flex-row items-start justify-start mt-10">
                            {/* CART ITEMS LIST*/}
                            <div className="w-full basis-3/5 flex flex-col justify-center items-center mr-8">
                                {cart.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex flex-row w-full min-w-[650px] max-w-[720px] h-[228px] items-center justify-start mb-8 p-6 border-[#474747] border-2 rounded-xl">
                                        {/* REMOVE BUTTON */}
                                        <UnstyledButton onClick={() => {removeItem(item.product.SKU)}}>
                                            <svg className="mr-6" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.11 13.5L21.591 27.0001M14.409 27.0001L13.89 13.5M28.842 8.68505C29.355 8.76305 29.865 8.84555 30.375 8.93405M28.842 8.68505L27.24 29.5095C27.1746 30.3574 26.7916 31.1493 26.1675 31.7269C25.5435 32.3045 24.7244 32.6253 23.874 32.625H12.126C11.2756 32.6253 10.4565 32.3045 9.83247 31.7269C9.2084 31.1493 8.82538 30.3574 8.76 29.5095L7.158 8.68505M28.842 8.68505C27.1108 8.42332 25.3706 8.22469 23.625 8.08955M7.158 8.68505C6.645 8.76155 6.135 8.84405 5.625 8.93255M7.158 8.68505C8.8892 8.42333 10.6294 8.2247 12.375 8.08955M23.625 8.08955V6.71555C23.625 4.94555 22.26 3.46955 20.49 3.41405C18.8304 3.36101 17.1696 3.36101 15.51 3.41405C13.74 3.46955 12.375 4.94705 12.375 6.71555V8.08955M23.625 8.08955C19.8806 7.80017 16.1194 7.80017 12.375 8.08955" stroke="#474747" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </UnstyledButton>  
                                        {/* PRODUCT IMAGE */}
                                        <UnstyledButton onClick={() => router.push(`/product-details/${item.product.Model}`)}>
                                            <Image
                                            radius="md"
                                            className="h-[192px] w-[192px] object-cover mr-6"
                                            src={item.product.image_link ? item.product.image_link : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                                            />
                                        </UnstyledButton>
                                        <div className="flex flex-col justify-start">
                                            {/* BRAND AND MODEL */}
                                            <p className="text-[20px]" style={{ fontFamily: "Epilogue", fontWeight: 600, letterSpacing: "-0.5px" }}>
                                                {item.product.Brand} {item.product.Model}
                                            </p>
                                            {/* PRICE */}
                                            <p className="text-[14px] mb-4" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>
                                                &#8369; {item.product.Price.toFixed(2)}
                                            </p>
                                            {/* COLOR */}
                                            <div className="w-full flex flex-row justify-start">
                                                <p className="text-[14px] w-[70px]" style={{ fontFamily: "Epilogue", color: "gray", letterSpacing: "-0.5px" }}>
                                                    Color
                                                </p>
                                                <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>
                                                    {item.product.Colorway}
                                                </p>
                                            </div>
                                            {/* SIZE */}
                                            <div className="w-full flex flex-row justify-start mb-4">
                                                <p className="text-[14px] w-[70px]" style={{ fontFamily: "Epilogue", color: "gray", letterSpacing: "-0.5px" }}>
                                                    Size
                                                </p>
                                                <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>
                                                    {item.product.Size}
                                                </p>
                                            </div>
                                            {/* QUANTITY */}
                                            <p className="text-[14px]" style={{ fontFamily: "Epilogue", color: "dark gray", letterSpacing: "-0.5px" }}>
                                                Quantity
                                            </p>
                                            <div className="flex flex-row items-center justify-between w-[100px] h-[30px] bg-[#1C1C1C] rounded-md">
                                                {/* MINUS BUTTON */}
                                                <ActionIcon onClick={() => {decreaseQuantity(item)} }variant="filled" color="#474747" size={30} aria-label="minus">
                                                    <svg width="10" height="2" viewBox="0 0 24 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M24 1C24 1.26522 23.8946 1.51957 23.7071 1.70711C23.5196 1.89464 23.2652 2 23 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H23C23.2652 0 23.5196 0.105357 23.7071 0.292893C23.8946 0.48043 24 0.734784 24 1Z" fill="white" />
                                                    </svg>
                                                </ActionIcon>
                                                {/* ITEM QUANTITY */}
                                                <p className="text-[20px]" style={{ fontFamily: "Epilogue", fontWeight: 700, color: "#D1D1D1", marginBottom: "-5px" }}>
                                                    {item.quantity}
                                                </p>
                                                {/* ADD BUTTON */}
                                                <ActionIcon onClick={() => {increaseQuantity(item)}} variant="filled" color="#474747" size={30} aria-label="add">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M24 12C24 12.2652 23.8946 12.5196 23.7071 12.7071C23.5196 12.8946 23.2652 13 23 13H13V23C13 23.2652 12.8946 23.5196 12.7071 23.7071C12.5196 23.8946 12.2652 24 12 24C11.7348 24 11.4804 23.8946 11.2929 23.7071C11.1054 23.5196 11 23.2652 11 23V13H1C0.734784 13 0.48043 12.8946 0.292893 12.7071C0.105357 12.5196 0 12.2652 0 12C0 11.7348 0.105357 11.4804 0.292893 11.2929C0.48043 11.1054 0.734784 11 1 11H11V1C11 0.734784 11.1054 0.48043 11.2929 0.292893C11.4804 0.105357 11.7348 0 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8946 0.48043 13 0.734784 13 1V11H23C23.2652 11 23.5196 11.1054 23.7071 11.2929C23.8946 11.4804 24 11.7348 24 12Z" fill="white" />
                                                    </svg>
                                                </ActionIcon>
                                            </div>
                                        </div>
                                        <div className="h-full flex flex-col items-end justify-between ml-auto">
                                            <Image
                                                src={brandLogoMap.get(item.product.Brand)}
                                                height={28}
                                            />
                                            <p className="text-[24px]" style={{ fontFamily: "EpilogueMedium", marginBottom: "-8px" }}>
                                                &#8369; {(item.product.Price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                            {/* ORDER SUMMARY */}
                            <div className="w-full flex flex-col basis-2/5 min-w-[493px] min-h-[558px] max-h-[558px] justify-start items-center py-12 px-16 border-[#474747] border-2 rounded-xl">
                                <p className="text-[32px] mr-auto mb-12" style={{ fontFamily: "EpilogueBold" }}>
                                    Order Summary</p>
                                
                                <div className="w-full flex flex-row items-center justify-between">
                                    <p className="text-[20px]" style={{ fontFamily: "EpilogueBold" }}>
                                        Quantity</p>
                                    <p className="text-[20px]" style={{ fontFamily: "Epilogue" }}>
                                        {getTotalQuantity()} items</p>
                                </div>
                                <div className="w-full flex flex-row items-center justify-between">
                                    <p className="text-[20px]" style={{ fontFamily: "EpilogueBold" }}>
                                        Total</p>
                                    <p className="text-[20px]" style={{ fontFamily: "Epilogue" }}>
                                        &#8369; {getTotalPrice().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <p className="text-[14px] mr-auto mb-12" style={{ fontFamily: "Epilogue", color: "gray" }}>
                                    *excluding delivery and other fees</p>
                                <p className="text-[16px] mr-auto mb-2 mt-auto" style={{ fontFamily: "Epilogue" }}>
                                    We accept</p>
                                <div className="w-full flex flex-row items-start justify-start">
                                    <Image
                                        className="h-[25px] mr-6"
                                        src="/card.png"
                                    />
                                    <Image
                                        className="h-[29px]"
                                        src="/gcash.png"
                                    />
                                </div>
                                <Button
                                    className="mt-auto"
                                    variant="filled"
                                    fullWidth
                                    radius="md"
                                    color="black"
                                    styles={{
                                        root: {
                                            height: "78px"
                                        },
                                        label: {
                                            fontFamily: "EpilogueBold",
                                            fontSize: "24px",
                                            color: "#EDEDED"
                                        }
                                    }}
                                >
                                    Proceed to Checkout
                                </Button>
                                    
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </MantineProvider>
    );
}