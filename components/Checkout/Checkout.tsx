'use client'

import { Button } from "@mantine/core"
import { useCart } from '@/utils/useCart';
import { useEffect } from "react";
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

export default function Checkout() {
    const { cart, removeFromCart, increaseCartItem, decreaseCartItem } = useCart();

    useEffect(() => {
        console.log("cart", cart);
    }, [cart]);


    return (
        <div className="flex flex-col items-start m-20 relative z-50 mb-[18rem] bg-white overflow-x-hidden min-h-screen">
            <Button
                component="a"
                href="/cart"
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

            <p style={epilogue.style} className="text-[72px] font-bold">Checkout</p>

            <div className="w-[43.906vw] h-[7.778vh] bg-[#474747]">

            </div>
        </div>
    )
}