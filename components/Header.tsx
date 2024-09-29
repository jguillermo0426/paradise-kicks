'use client'

import { Anchor, Divider, Image } from '@mantine/core';  
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
})

type SelectedProps = {
    navSelected: string;
}

export default function Header({navSelected}: SelectedProps) {

    const selected = "group mx-5 flex items-center justify-center w-[7.5rem] pt-20 pb-3 px-5 border-2 border-solid rounded-b-[0.625rem] border-[#38BDBA] -mt-16 hover:cursor-pointer";
    const unselected = "group mx-5 flex items-center hover:bg-[#38BDBA] w-[7.5rem] justify-center pt-20 pb-3 px-5 border-2 border-none rounded-b-[0.625rem] -mt-16 hover:cursor-pointer";

    const selectedText = 'font-semibold text-[#38BDBA] text-xl';
    const unselectedText = 'font-semibold text-black group-hover:text-white text-xl'

    return(
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
                    <Anchor href="/product-listing" underline='never'>
                        <div className={`group ${navSelected === "Catalogue" ? selected : unselected}`}>
                            <p style={epilogue.style} className={navSelected === "Catalogue" ? selectedText : unselectedText}>Catalogue</p>
                        </div>
                    </Anchor>

                    <Anchor href="/" underline='never'>
                        <div className={navSelected === "Contact" ? selected : unselected}>
                            <p style={epilogue.style} className={navSelected === "Contact" ? selectedText : unselectedText}>Contact</p>
                        </div>
                    </Anchor>
                </div>

                <div className="flex flex-row items-center justify-end pt-20 pb-3 border-2 border-none -mt-16 w-[40rem]">
                    <div className='m-5 flex items-center justify-center w-6 h-6 rounded-full bg-black'>
                        <p style={epilogue.style} className='p-0 m-0 font-normal text-white text-sm'>0</p>
                    </div>
                    <p style={epilogue.style} className='font-semibold text-black text-xl'>My Cart</p>
                </div>
            </div>    
            <Divider className='w-full' color="#474747"/>
        </main>
    );
}