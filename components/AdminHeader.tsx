'use client'

import { Anchor, Divider, Image } from '@mantine/core';
import { Epilogue } from 'next/font/google';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

type SelectedProps = {
    navSelected: string;
}


export default function Header({ navSelected }: SelectedProps) {
    const router = useRouter();
    const selected = "group mx-5 transition-colors flex items-center justify-center w-[7.5rem] pt-20 pb-3 px-5 border-2 border-solid rounded-b-[0.625rem] border-[#38BDBA] -mt-16 hover:cursor-pointer";
    const unselected = "group mx-5 transition-colors flex items-center hover:bg-[#38BDBA] w-[7.5rem] justify-center pt-20 pb-3 px-5 border-2 border-none rounded-b-[0.625rem] -mt-16 hover:cursor-pointer";

    const selectedText = 'font-semibold transition-colors text-[#38BDBA] text-xl';
    const unselectedText = 'font-semibold transition-colors text-black group-hover:text-white text-xl'

    const logOut = () => {
        Cookies.remove("loggedin");
        router.push("/login");
    }


    return (
        <main className="flex flex-col bg-white w-full h-[6rem] justify-between items-center">
            <div className="flex flex-row bg-white w-full h-auto justify-between items-between px-10">
                <div className='w-[40rem]'>
                    <Image
                        src="/blue logo.png"
                        h={90}
                        w={90}
                    />
                </div>

                <div className='flex flex-row w-[40rem] items-center justify-center'>
                    <Anchor href="/admin-dashboard/inventory" underline='never'>
                        <div className={`group ${navSelected === "Inventory" ? selected : unselected}`}>
                            <p style={epilogue.style} className={navSelected === "Inventory" ? selectedText : unselectedText}>Inventory</p>
                        </div>
                    </Anchor>

                    <Anchor href="/admin-dashboard/orders" underline='never'>
                        <div className={navSelected === "Orders" ? selected : unselected}>
                            <p style={epilogue.style} className={navSelected === "Orders" ? selectedText : unselectedText}>Orders</p>
                        </div>
                    </Anchor>

                    <Anchor href="/admin-dashboard/brands" underline='never'>
                        <div className={navSelected === "Brands" ? selected : unselected}>
                            <p style={epilogue.style} className={navSelected === "Brands" ? selectedText : unselectedText}>Brands</p>
                        </div>
                    </Anchor>

                    <Anchor href="/admin-dashboard/faqs" underline='never'>
                        <div className={navSelected === "FAQs" ? selected : unselected}>
                            <p style={epilogue.style} className={navSelected === "FAQs" ? selectedText : unselectedText}>FAQs</p>
                        </div>
                    </Anchor>

                    <Anchor href="/" underline='never'>
                        <div className={navSelected === "Feedback" ? selected : unselected}>
                            <p style={epilogue.style} className={navSelected === "Feedback" ? selectedText : unselectedText}>Feedback</p>
                        </div>
                    </Anchor>
                </div>

                <div className="flex flex-row items-center justify-end pt-20 pb-3 border-2 border-none -mt-16 w-[40rem]">
                    <div className='m-5 flex items-center justify-center w-6 h-6 rounded-full bg-black'>
                    </div>
                    <Anchor onClick={logOut} underline='never'>
                        <p style={epilogue.style} className='font-semibold text-black text-xl'>Logout</p>
                    </Anchor>
                </div>
            </div>
            <Divider className='w-full' color="#474747" />
        </main>
    );
}