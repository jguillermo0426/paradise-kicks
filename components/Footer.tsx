'use client'

import { Anchor, Divider, Image } from '@mantine/core';  
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
})

export default function Footer() {

    return(
        <main className="flex flex-col bg-[#38BDBA] w-full justify-center items-center overflow-hidden">
            <div className="max-tablet:flex-col ml-[10%] flex flex-row bg-[#38BDBA] w-full justify-start items-center 
                            h-[350px] max-lg:h-[420px] max-tablet:h-[820px]"> 
                <div className='h-full flex flex-row items-start justify-center'>
                    <div className='max-tablet:pb-0 max-tablet:mr-10 w-full
                                    pt-0 mt-10 w-[60%]
                                    flex flex-col items-center justify-center p-12 mt-16'>
                        <Image
                            src="/white logo.png"
                            className='mb-5 max-tablet:mt-10 max-tablet:p-0 max-tablet:m-0 h-[35px]'
                        />
                        <p className="max-tablet:hidden mr-10 font-extrabold italic text-white text-lg" style={epilogue.style}>Paradise Kicks</p>
                    </div>
                    <Divider orientation='vertical' className="max-tablet:hidden ml-10 max-lg:ml-2" color="white"/>
                </div>

                <div className='max-tablet:pt-0 max-tablet:mt-0 max-tablet:flex-col max-tablet:gap-10 max-tablet:ml-0 max-lg:ml-16 flex flex-row items-start justify-center p-12 pl-20 m-20'>
                    <div className="max-tablet:mt-20 flex max-lg:flex-col items-start">
                        <div className='flex flex-col items-start justify-center mx-10'>
                            <p style={epilogue.style} className='max-tablet:text-[18px] max-tablet:mb-2 font-black text-white text-xl mb-5'>CATALOGUE</p>

                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-tablet:text-[12px] font-light text-white text-sm mb-10'>Current Offers</p>
                            </Anchor>
                        </div>

                        <div className='flex flex-col items-start justify-center mx-10'>
                            <p style={epilogue.style} className='max-tablet:text-[18px] max-tablet:mb-2 font-black text-white text-xl mb-5'>QUICK HELP</p>

                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-tablet:text-[12px] font-light text-white text-sm'>Track Order</p>
                            </Anchor>
                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-tablet:text-[12px] font-light text-white text-sm'>FAQs</p>
                            </Anchor>
                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-tablet:text-[12px] font-light text-white text-sm'>Feedback</p>
                            </Anchor>
                        </div>
                    </div>

                    <div className="flex max-lg:flex-col items-start">
                        <div className='flex flex-col items-start justify-center mx-10'>
                            <p style={epilogue.style} className='max-tablet:text-[18px] max-tablet:mb-2 font-black text-white text-xl mb-5'>GET IN TOUCH</p>
                            <p style={epilogue.style} className='max-tablet:text-[12px] font-light text-white text-sm mb-5'>paradisekicks2000@gmail.com</p>
                            <p style={epilogue.style} className='max-tablet:text-[12px] font-light text-white text-sm'>9:00 AM - 11:00 PM</p>
                            <p style={epilogue.style} className='max-tablet:text-[12px] font-light text-white text-sm max-[1014px]:mb-10'>Manila, Philippines, 1116</p>
                        </div>

                        <div className='flex flex-col items-start justify-center mx-10'>
                            <p style={epilogue.style} className='max-[612px]:hidden font-black text-white text-xl mb-5'>FOLLOW US</p>
                            
                            <div className='flex flex-row gap-1'>
                                <Anchor href="https://www.facebook.com/63paradisekicks">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path></svg>
                                </Anchor>

                                <Anchor href="https://www.instagram.com/63paradisekicks/">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path></svg>
                                </Anchor>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Divider orientation='horizontal' className='w-full' color="white"/>
            
            <div className="max-sm:justify-center flex flex-row w-full bg-[#177F7D] h-[2rem] justify-end items-center px-10">
                <p style={epilogue.style} className='max-tablet:text-[12px] text-white font-semibold text-sm'>© Paradise Kicks 2024 All Rights Reserved</p>
            </div>
        </main>
    );
}