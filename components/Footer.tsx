'use client'

import { Anchor, Divider, Image } from '@mantine/core';  
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
})

export default function Footer() {

    return(
        <main className="flex flex-col bg-[#38BDBA] w-full h-auto fixed bottom-0 -z-10 justify-center items-center">
            <div className="flex flex-row bg-[#38BDBA] w-full h-[16rem] justify-start items-center">
                <div className='flex flex-row items-start justify-center h-full'>
                    <div className='flex flex-col items-center justify-center p-12'>
                        <Image
                            src="/white logo.png"
                            className='mb-5'
                            h={40}
                        />
                        <p className="font-extrabold italic text-white text-xl" style={epilogue.style}>Paradise Kicks</p>
                    </div>
                    <Divider orientation='vertical' color="white"/>
                </div>

                <div className='flex flex-row items-start justify-center p-12 m-20'>
                    <div className='flex flex-col items-start justify-center mx-10'>
                        <p style={epilogue.style} className='font-black text-white text-xl mb-5'>CATALOGUE</p>

                        <Anchor href="/" underline="hover" c="white">    
                            <p style={epilogue.style} className='font-light text-white text-sm'>Current Offers</p>
                        </Anchor>
                    </div>

                    <div className='flex flex-col items-start justify-center mx-10'>
                        <p style={epilogue.style} className='font-black text-white text-xl mb-5'>QUICK HELP</p>

                        <Anchor href="/" underline="hover" c="white">    
                            <p style={epilogue.style} className='font-light text-white text-sm'>Track Order</p>
                        </Anchor>
                        <Anchor href="/" underline="hover" c="white">    
                            <p style={epilogue.style} className='font-light text-white text-sm'>FAQs</p>
                        </Anchor>
                        <Anchor href="/" underline="hover" c="white">    
                            <p style={epilogue.style} className='font-light text-white text-sm'>Feedback</p>
                        </Anchor>
                    </div>

                    <div className='flex flex-col items-start justify-center mx-10'>
                        <p style={epilogue.style} className='font-black text-white text-xl mb-5'>GET IN TOUCH</p>
                        <p style={epilogue.style} className='font-light text-white text-sm mb-5'>paradisekicks2000@gmail.com</p>
                        <p style={epilogue.style} className='font-light text-white text-sm'>9:00 AM - 11:00 PM</p>
                        <p style={epilogue.style} className='font-light text-white text-sm'>Manila, Philippines, 1116</p>
                    </div>

                    <div className='flex flex-col items-start justify-center mx-10'>
                        <p style={epilogue.style} className='font-black text-white text-xl mb-5'>FOLLOW US</p>
                    </div>
                </div>
            </div>

            <Divider orientation='horizontal' className='w-full' color="white"/>
            
            <div className="flex flex-row w-full bg-[#177F7D] h-[2rem] justify-end items-center px-10">
                <p style={epilogue.style} className='text-white font-semibold text-sm'>© Paradise Kicks 2024 All Rights Reserved</p>
            </div>
        </main>
    );
}