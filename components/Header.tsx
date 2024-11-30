'use client'

import { Anchor, Divider, Image, Badge, UnstyledButton } from '@mantine/core';  
import { Epilogue } from 'next/font/google';
import { useCart } from '@/utils/useCart';
import { useEffect, useState, } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from "framer-motion";

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
})

type SelectedProps = {
    navSelected: string;
}

export default function Header({navSelected}: SelectedProps) {


    const selected = "max-[1024px]:w-[7rem] max-[912px]:mx-1 group mx-5 transition-colors flex items-center justify-center w-[9rem] pt-20 pb-3 px-5 border-2 border-solid rounded-b-[0.625rem] border-[#177F7D] -mt-16 hover:bg-[#F0F0F0] hover:cursor-pointer";
    const unselected = "max-[1024px]:w-[7rem] max-[912px]:mx-1 group mx-5 transition-colors flex items-center hover:bg-[#177F7D] w-[9rem] justify-center pt-20 pb-3 px-5 border-2 border-none rounded-b-[0.625rem] -mt-16 hover:cursor-pointer";

    const selectedText = 'font-semibold transition-colors text-[#177F7D] max-[1024px]:text-[16px] text-xl';
    const unselectedText = 'font-semibold transition-colors text-black group-hover:text-white max-[1024px]:text-[16px] text-xl'

    const selectedToggle = "group transition-colors flex w-full justify-left pl-5 p-3 rounded-lg outline outline-2 outline-[#177F7D] hover:bg-[#F0F0F0] hover:cursor-pointer";
    const unselectedToggle = "group transition-colors flex w-full justify-left pl-5 p-3 rounded-lg hover:bg-[#177F7D] hover:cursor-pointer";

    const selectedTextToggle = 'max-[420px]:text-[16px] font-semibold transition-colors text-[#177F7D] text-xl';
    const unselectedTextToggle = 'max-[420px]:text-[16px] font-semibold transition-colors text-black group-hover:text-white text-xl'

    const { cart } = useCart();
    const [items, setItems] = useState(0);

    const [ isOpen, setIsOpen ] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    }

    const animations = {
        hidden: { opacity: 0, y: -20 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };

    useEffect(() => {
        setItems(cart.length);
    }, [cart]);

    return(
        <main className="z-50 shadow-lg sticky top-0 flex flex-col w-full tablet:h-full justify-between items-center">
            <div className="flex flex-row bg-white w-full h-auto justify-between items-between px-10">
                <div className='w-[90px] h-[90px] hidden tablet:flex ml-10  flex-col justify-center items-center'>
                    <Link href="/">
                        <UnstyledButton>
                        <Image
                            src="/blue logo.png"
                            h={90}
                            w={90}
                            /> 
                        </UnstyledButton>
                    </Link>
                </div>

                {/* NAVBAR FOR LARGE SCREENS */}
                <div className='hidden tablet:flex flex-row items-center justify-center'>
                    <Anchor href="/" underline='never'>
                        <div className={`group ${navSelected === "Home" ? selected : unselected}`}>
                            <p style={epilogue.style} className={navSelected === "Home" ? selectedText : unselectedText}>Home</p>
                        </div>
                    </Anchor>

                    <Anchor href="/product-listing" underline='never'>
                        <div className={`group ${navSelected === "Catalogue" ? selected : unselected}`}>
                            <p style={epilogue.style} className={navSelected === "Catalogue" ? selectedText : unselectedText}>Catalogue</p>
                        </div>
                    </Anchor>

                    <Anchor href="/order-tracker" underline='never'>
                        <div className={navSelected === "Order Tracker" ? selected : unselected}>
                            <p style={epilogue.style} className={navSelected === "Order Tracker" ? selectedText : unselectedText}>Tracker</p>
                        </div>
                    </Anchor>
                </div>

                {/* NAVBAR TOGGLE FOR SMALL SCREENS */}
                <div className=" flex flex-col w-full tablet:hidden">
                    <div className="flex flex-row justify-between">
                        <button className="flex flex-row items-left mt-7 max-w-[38px] h-[38px] sm:w-[48px] sm:h-[48px] sm:mt-5" onClick={toggleNavbar}>
                            { !isOpen ? (
                                <svg className="w-full h-full" fill="none" strokeWidth="2" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                                </svg>
                            ) : (
                                <svg className="w-full h-full" data-slot="icon" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
                                </svg>
                            )}
                        </button>
                        
                        {/* LOGO FOR SMALL SCREENS */}
                        <div className='mt-3 mr-5 justify-center items-center tablet:hidden'>
                            <Link href="/">
                                <UnstyledButton>
                                <Image
                                    src="/blue logo.png"
                                    h={70}
                                    w={70}
                                    /> 
                                </UnstyledButton>
                            </Link>
                        </div>
                            
                        {/* CART FOR SMALL SCREENS */}
                        <Link href="/cart">
                            <div className="-mt-[3.2rem] pb-5 mr-2 flex flex-row items-center justify-end pt-20 border-2 border-none md:hidden">
                                <Badge size="sm" color="#2E7D31" circle 
                                className="z-10"
                                styles={{ 
                                    root: { 
                                        outline: "3px solid white",
                                        marginRight: "-45px",
                                        marginTop: "-28px"
                                    },
                                    label: {
                                        fontFamily: "Epilogue",
                                        fontWeight: "600",
                                        fontSize: "11px",
                                        color: "white",
                                        paddingTop: "2px"
                                    }
                                }}
                                >
                                    {items}
                                </Badge>
                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.85001 3.23748C1.85001 2.86949 1.99619 2.51657 2.2564 2.25637C2.5166 1.99616 2.86952 1.84998 3.23751 1.84998H6.24931C7.0312 1.84974 7.78676 2.13247 8.37642 2.64596C8.96607 3.15944 9.34998 3.86897 9.45721 4.64348L9.58301 5.54998C17.8896 5.568 26.1722 6.44337 34.299 8.16218C34.6541 8.23795 34.9653 8.44989 35.1659 8.75253C35.3665 9.05516 35.4405 9.42437 35.372 9.78093C34.6274 13.6659 33.6275 17.4975 32.3787 21.2509C32.2866 21.5274 32.1098 21.7679 31.8734 21.9382C31.637 22.1086 31.3529 22.2001 31.0615 22.2H11.1C10.2 22.2004 9.31967 22.4631 8.56662 22.956C7.81356 23.4488 7.22045 24.1504 6.85981 24.975H31.9125C32.2805 24.975 32.6334 25.1212 32.8936 25.3814C33.1538 25.6416 33.3 25.9945 33.3 26.3625C33.3 26.7305 33.1538 27.0834 32.8936 27.3436C32.6334 27.6038 32.2805 27.75 31.9125 27.75H5.10601C4.91489 27.75 4.72582 27.7106 4.55065 27.6341C4.37549 27.5577 4.21801 27.4459 4.08809 27.3057C3.95817 27.1655 3.8586 27 3.79564 26.8196C3.73268 26.6391 3.70768 26.4476 3.72221 26.257C3.83401 24.8075 4.37011 23.4229 5.26365 22.2761C6.15718 21.1292 7.3686 20.2708 8.74681 19.8079L6.70811 5.02458C6.69289 4.91375 6.63802 4.81219 6.55366 4.73871C6.46931 4.66524 6.36118 4.62483 6.24931 4.62498H3.23751C2.86952 4.62498 2.5166 4.47879 2.2564 4.21859C1.99619 3.95838 1.85001 3.60546 1.85001 3.23748ZM11.1 32.375C11.1 33.111 10.8076 33.8168 10.2872 34.3372C9.76681 34.8576 9.06098 35.15 8.32501 35.15C7.58903 35.15 6.8832 34.8576 6.36278 34.3372C5.84237 33.8168 5.55001 33.111 5.55001 32.375C5.55001 31.639 5.84237 30.9332 6.36278 30.4128C6.8832 29.8923 7.58903 29.6 8.32501 29.6C9.06098 29.6 9.76681 29.8923 10.2872 30.4128C10.8076 30.9332 11.1 31.639 11.1 32.375ZM28.675 35.15C29.411 35.15 30.1168 34.8576 30.6372 34.3372C31.1576 33.8168 31.45 33.111 31.45 32.375C31.45 31.639 31.1576 30.9332 30.6372 30.4128C30.1168 29.8923 29.411 29.6 28.675 29.6C27.939 29.6 27.2332 29.8923 26.7128 30.4128C26.1924 30.9332 25.9 31.639 25.9 32.375C25.9 33.111 26.1924 33.8168 26.7128 34.3372C27.2332 34.8576 27.939 35.15 28.675 35.15Z" fill="black"/>
                                </svg>
                            </div>
                        </Link>
                    </div>

                    <AnimatePresence mode="wait">
                        { isOpen && (
                            <motion.div
                                layout="position"
                                initial="hidden"
                                animate="show"
                                variants={animations}
                            >
                            
                            <div className="flex basis-full flex-col items-center pb-3 mt-2">
                                <div className='flex flex-col justify-items-stretch	w-full'>
                                <motion.div>
                                    <Anchor href="/" underline='never'>
                                        <div className="justify-stretch flex row items-center px-3 mb-1">
                                            <div className={`group ${navSelected === "Home" ? selectedToggle : unselectedToggle}`}>
                                                <p style={epilogue.style} className={navSelected === "Home" ? selectedTextToggle : unselectedTextToggle}>Home</p>
                                                <svg className="w-[20px] h-[20px] ml-auto mt-1 stroke-[#177F7D]" data-slot="icon" fill="none" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </Anchor>
                                </motion.div>

                                <motion.div>
                                    <Anchor href="/product-listing" underline='never'>
                                        <div className="my-1 justify-stretch flex row items-center px-3 mb-1">
                                            <div className={`group ${navSelected === "Catalogue" ? selectedToggle : unselectedToggle}`}>
                                                <p style={epilogue.style} className={navSelected === "Catalogue" ? selectedTextToggle : unselectedTextToggle}>Catalogue</p>
                                                <svg className="w-[20px] h-[20px] ml-auto mt-1 stroke-[#177F7D]" data-slot="icon" fill="none" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </Anchor>
                                </motion.div>

                                <motion.div>
                                <Anchor href="/order-tracker" underline='never'>
                                        <div className="my-1 justify-stretch flex row items-center px-3 mb-1">
                                            <div className={`group ${navSelected === "Order Tracker" ? selectedToggle : unselectedToggle}`}>
                                                <p style={epilogue.style} className={navSelected === "Order Tracker" ? selectedTextToggle : unselectedTextToggle}>Tracker</p>
                                                <svg className="w-[20px] h-[20px] ml-auto mt-1 stroke-[#177F7D]" data-slot="icon" fill="none" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </Anchor>
                                </motion.div>
                                </div>
                            </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CART */}
                <Link href="/cart">
                    <div className="hidden tablet:flex mr-8  flex-row items-center justify-end pt-20 pb-3 border-2 border-none -mt-12 md:px-5">
                        <Badge size="sm" color="#2E7D31" circle 
                        className="z-10"
                        styles={{ 
                            root: { 
                                outline: "3px solid white",
                                marginRight: "-45px",
                                marginTop: "-28px"
                            },
                            label: {
                                fontFamily: "Epilogue",
                                fontWeight: "600",
                                fontSize: "11px",
                                color: "white",
                                paddingTop: "2px"
                            }
                        }}
                        >
                            {items}
                        </Badge>
                        <svg className="w-[37px] h-[37px]"viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.85001 3.23748C1.85001 2.86949 1.99619 2.51657 2.2564 2.25637C2.5166 1.99616 2.86952 1.84998 3.23751 1.84998H6.24931C7.0312 1.84974 7.78676 2.13247 8.37642 2.64596C8.96607 3.15944 9.34998 3.86897 9.45721 4.64348L9.58301 5.54998C17.8896 5.568 26.1722 6.44337 34.299 8.16218C34.6541 8.23795 34.9653 8.44989 35.1659 8.75253C35.3665 9.05516 35.4405 9.42437 35.372 9.78093C34.6274 13.6659 33.6275 17.4975 32.3787 21.2509C32.2866 21.5274 32.1098 21.7679 31.8734 21.9382C31.637 22.1086 31.3529 22.2001 31.0615 22.2H11.1C10.2 22.2004 9.31967 22.4631 8.56662 22.956C7.81356 23.4488 7.22045 24.1504 6.85981 24.975H31.9125C32.2805 24.975 32.6334 25.1212 32.8936 25.3814C33.1538 25.6416 33.3 25.9945 33.3 26.3625C33.3 26.7305 33.1538 27.0834 32.8936 27.3436C32.6334 27.6038 32.2805 27.75 31.9125 27.75H5.10601C4.91489 27.75 4.72582 27.7106 4.55065 27.6341C4.37549 27.5577 4.21801 27.4459 4.08809 27.3057C3.95817 27.1655 3.8586 27 3.79564 26.8196C3.73268 26.6391 3.70768 26.4476 3.72221 26.257C3.83401 24.8075 4.37011 23.4229 5.26365 22.2761C6.15718 21.1292 7.3686 20.2708 8.74681 19.8079L6.70811 5.02458C6.69289 4.91375 6.63802 4.81219 6.55366 4.73871C6.46931 4.66524 6.36118 4.62483 6.24931 4.62498H3.23751C2.86952 4.62498 2.5166 4.47879 2.2564 4.21859C1.99619 3.95838 1.85001 3.60546 1.85001 3.23748ZM11.1 32.375C11.1 33.111 10.8076 33.8168 10.2872 34.3372C9.76681 34.8576 9.06098 35.15 8.32501 35.15C7.58903 35.15 6.8832 34.8576 6.36278 34.3372C5.84237 33.8168 5.55001 33.111 5.55001 32.375C5.55001 31.639 5.84237 30.9332 6.36278 30.4128C6.8832 29.8923 7.58903 29.6 8.32501 29.6C9.06098 29.6 9.76681 29.8923 10.2872 30.4128C10.8076 30.9332 11.1 31.639 11.1 32.375ZM28.675 35.15C29.411 35.15 30.1168 34.8576 30.6372 34.3372C31.1576 33.8168 31.45 33.111 31.45 32.375C31.45 31.639 31.1576 30.9332 30.6372 30.4128C30.1168 29.8923 29.411 29.6 28.675 29.6C27.939 29.6 27.2332 29.8923 26.7128 30.4128C26.1924 30.9332 25.9 31.639 25.9 32.375C25.9 33.111 26.1924 33.8168 26.7128 34.3372C27.2332 34.8576 27.939 35.15 28.675 35.15Z" fill="black"/>
                        </svg>
                        
                        <p style={epilogue.style} className='hidden md:font-semibold text-black desktop:text-sm text-xl ml-6'>My Cart</p>
                    </div>
                </Link>
            </div>    

            <Divider className='w-full' color="#474747"/>
        </main>
    );
}