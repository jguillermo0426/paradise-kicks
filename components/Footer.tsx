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
            <div className="max-[612px]:flex-col ml-[10%] flex flex-row bg-[#38BDBA] w-full justify-start items-center 
                            h-[350px] max-[1358px]:h-[420px] max-[820px]:h-[820px]"> 
                <div className='h-full flex flex-row items-start justify-center'>
                    <div className='max-[612px]:pb-0 max-[612px]:mr-10 w-full
                                    max-[420px]:pt-0 max-[420px]:mt-10 max-[420px]:w-[60%]
                                    flex flex-col items-center justify-center p-12 mt-16'>
                        <Image
                            src="/white logo.png"
                            className='mb-5 max-[612px]:mt-10 max-[612px]:p-0 max-[612px]:m-0 h-[35px]'
                        />
                        <p className="max-[612px]:hidden mr-10 font-extrabold italic text-white text-lg" style={epilogue.style}>Paradise Kicks</p>
                    </div>
                    <Divider orientation='vertical' className="max-[612px]:hidden ml-10 max-[1358px]:ml-2" color="white"/>
                </div>

                <div className='max-[612px]:pt-0 max-[612px]:mt-0 max-[820px]:flex-col max-[820px]:gap-10 max-[888px]:ml-0 max-[1358px]:ml-16 flex flex-row items-start justify-center p-12 pl-20 m-20'>
                    <div className="max-[612px]:mt-20 flex max-[1358px]:flex-col items-start">
                        <div className='flex flex-col items-start justify-center mx-10'>
                            <p style={epilogue.style} className='max-[612px]:text-[18px] max-[612px]:mb-2 font-black text-white text-xl mb-5'>CATALOGUE</p>

                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-[612px]:text-[12px] font-light text-white text-sm mb-10'>Current Offers</p>
                            </Anchor>
                        </div>

                        <div className='flex flex-col items-start justify-center mx-10'>
                            <p style={epilogue.style} className='max-[612px]:text-[18px] max-[612px]:mb-2 font-black text-white text-xl mb-5'>QUICK HELP</p>

                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-[612px]:text-[12px] font-light text-white text-sm'>Track Order</p>
                            </Anchor>
                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-[612px]:text-[12px] font-light text-white text-sm'>FAQs</p>
                            </Anchor>
                            <Anchor href="/" underline="hover" c="white">    
                                <p style={epilogue.style} className='max-[612px]:text-[12px] font-light text-white text-sm'>Feedback</p>
                            </Anchor>
                        </div>
                    </div>

                    <div className="flex max-[1014px]:flex-col items-start">
                        <div className='flex flex-col items-start justify-center mx-10'>
                            <p style={epilogue.style} className='max-[612px]:text-[18px] max-[612px]:mb-2 font-black text-white text-xl mb-5'>GET IN TOUCH</p>
                            <p style={epilogue.style} className='max-[612px]:text-[12px] font-light text-white text-sm mb-5'>paradisekicks2000@gmail.com</p>
                            <p style={epilogue.style} className='max-[612px]:text-[12px] font-light text-white text-sm'>9:00 AM - 11:00 PM</p>
                            <p style={epilogue.style} className='max-[612px]:text-[12px] font-light text-white text-sm max-[1014px]:mb-10'>Manila, Philippines, 1116</p>
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
            
            <div className="max-[420px]:justify-center flex flex-row w-full bg-[#177F7D] h-[2rem] justify-end items-center px-10">
                <p style={epilogue.style} className='max-[612px]:text-[12px] text-white font-semibold text-sm'>© Paradise Kicks 2024 All Rights Reserved</p>
            </div>
        </main>
    );
}