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

    const selected = "max-[1024px]:w-[7rem] max-[912px]:mx-1 group mx-5 transition-colors flex items-center justify-center w-[9rem] pt-20 pb-3 px-5 border-2 border-solid rounded-b-[0.625rem] border-[#177F7D] -mt-16 hover:bg-[#F0F0F0] hover:cursor-pointer";
    const unselected = "max-[1024px]:w-[7rem] max-[912px]:mx-1 group mx-5 transition-colors flex items-center hover:bg-[#177F7D] w-[9rem] justify-center pt-20 pb-3 px-5 border-2 border-none rounded-b-[0.625rem] -mt-16 hover:cursor-pointer";

    const selectedText = 'font-semibold transition-colors text-[#177F7D] max-[1024px]:text-[16px] text-xl';
    const unselectedText = 'font-semibold transition-colors text-black group-hover:text-white max-[1024px]:text-[16px] text-xl'

    const logOut = () => {
        Cookies.remove("loggedin");
        router.push("/login");
    }


    return (
        <main className="flex flex-col bg-white w-full h-[6rem] justify-between items-center">
            <div className="flex flex-row bg-white w-full h-auto justify-between items-between px-10">
                <div className='pl-12 w-[40rem]'>
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
                    <div className="ml-1 m-5 flex items-center justify-center w-6 h-6">
                        <svg
                            data-slot="icon"
                            fill="none"
                            stroke-width="2"
                            stroke="#177F7D"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="w-full h-full mb-1"
                        >
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                            ></path>
                        </svg>
                    </div>
                    <Anchor onClick={logOut} underline='never'>
                        <p style={epilogue.style} className='pr-12 font-semibold text-black text-xl'>Logout</p>
                    </Anchor>
                </div>
            </div>
            <Divider className='w-full' color="#474747" />
        </main>
    );
}