'use client'
import { useForm } from '@mantine/form';
import { TextInput, Button, NumberInput, FileButton, Tooltip, FloatingIndicator, Tabs, Image } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CardProduct, GroupedProduct, Product } from '@/types/types';
import { Notifications, showNotification } from '@mantine/notifications';
import Papa from 'papaparse';
import SearchBar from '../SearchBar';
import { Epilogue } from 'next/font/google';

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
})


export default function AdminStock() {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);

    const [value, setValue] = useState<string | null>('1');
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const setControlRef = (val: string) => (node: HTMLButtonElement) => {
        controlsRefs[val] = node;
        setControlsRefs(controlsRefs);
    };
    
    const handleNotification = () => {
        showNotification({
          title: 'Successfully submitted!',
          message: 'The products have been successfully submitted.',
        });
      };

    return ( 
        <div className="relative z-50 mb-[18rem] bg-white overflow-hidden flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">            
            <div className='flex flex-row items-center justify-end w-full'>
                <SearchBar/>
            </div>

            <div className='flex flex-row items-center justify-between w-full'>
                <p style={epilogue.style} className="text-[72px] font-bold">Orders</p>

                <div className='flex flex-row items-center mt-[5rem] w-[43vw] justify-between'>
                    <div className='w-[13vw] h-[14vh] p-2 bg-[#FBC02D33] rounded-lg flex flex-row items-start justify-start'>
                        <Image
                            src="/clock.svg"
                            h={50}
                            w="auto"
                            fit="contain"
                            fallbackSrc="/placeholder.svg"
                            className='mr-4 mt-1'
                        />
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#FBC02D]">25</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#FBC02D]">Pending</p>
                        </div>
                    </div>

                    <div className='w-[13vw] h-[14vh] p-2 bg-[#38BDBA33] rounded-lg flex flex-row items-start justify-start'>
                        <Image
                            src="/clock blue.svg"
                            h={50}
                            w="auto"
                            fit="contain"
                            fallbackSrc="/placeholder.svg"
                            className='mr-4 mt-1'
                        />
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#38BDBA]">25</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#38BDBA]">To Ship</p>
                        </div>
                    </div>

                    <div className='w-[13vw] h-[14vh] p-2 bg-[#4747474D] rounded-lg flex flex-row items-start justify-start'>
                        <Image
                            src="/clock gray.svg"
                            h={50}
                            w="auto"
                            fit="contain"
                            fallbackSrc="/placeholder.svg"
                            className='mr-4 mt-1'
                        />
                        <div className='flex flex-col items-start justify-start'>
                            <p style={epilogue.style} className="text-[40px] font-bold p-0 m-0 text-[#474747]">25</p>
                            <p style={epilogue.style} className="text-[20px] font-normal p-0 -mt-3 text-[#474747]">In Transit</p>
                        </div>
                    </div>
                </div>
  
            </div>
            
            
            <Notifications></Notifications>
            
        </div>
    );
}
