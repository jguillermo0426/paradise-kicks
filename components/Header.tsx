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

    const selected = "group mx-5 transition-colors flex items-center justify-center w-[7.5rem] pt-20 pb-3 px-5 border-2 border-solid rounded-b-[0.625rem] border-[#38BDBA] -mt-16 hover:cursor-pointer";
    const unselected = "group mx-5 transition-colors flex items-center hover:bg-[#38BDBA] w-[7.5rem] justify-center pt-20 pb-3 px-5 border-2 border-none rounded-b-[0.625rem] -mt-16 hover:cursor-pointer";

    const selectedText = 'font-semibold transition-colors text-[#38BDBA] text-xl';
    const unselectedText = 'font-semibold transition-colors text-black group-hover:text-white text-xl'

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
                    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.85001 3.23748C1.85001 2.86949 1.99619 2.51657 2.2564 2.25637C2.5166 1.99616 2.86952 1.84998 3.23751 1.84998H6.24931C7.0312 1.84974 7.78676 2.13247 8.37642 2.64596C8.96607 3.15944 9.34998 3.86897 9.45721 4.64348L9.58301 5.54998C17.8896 5.568 26.1722 6.44337 34.299 8.16218C34.6541 8.23795 34.9653 8.44989 35.1659 8.75253C35.3665 9.05516 35.4405 9.42437 35.372 9.78093C34.6274 13.6659 33.6275 17.4975 32.3787 21.2509C32.2866 21.5274 32.1098 21.7679 31.8734 21.9382C31.637 22.1086 31.3529 22.2001 31.0615 22.2H11.1C10.2 22.2004 9.31967 22.4631 8.56662 22.956C7.81356 23.4488 7.22045 24.1504 6.85981 24.975H31.9125C32.2805 24.975 32.6334 25.1212 32.8936 25.3814C33.1538 25.6416 33.3 25.9945 33.3 26.3625C33.3 26.7305 33.1538 27.0834 32.8936 27.3436C32.6334 27.6038 32.2805 27.75 31.9125 27.75H5.10601C4.91489 27.75 4.72582 27.7106 4.55065 27.6341C4.37549 27.5577 4.21801 27.4459 4.08809 27.3057C3.95817 27.1655 3.8586 27 3.79564 26.8196C3.73268 26.6391 3.70768 26.4476 3.72221 26.257C3.83401 24.8075 4.37011 23.4229 5.26365 22.2761C6.15718 21.1292 7.3686 20.2708 8.74681 19.8079L6.70811 5.02458C6.69289 4.91375 6.63802 4.81219 6.55366 4.73871C6.46931 4.66524 6.36118 4.62483 6.24931 4.62498H3.23751C2.86952 4.62498 2.5166 4.47879 2.2564 4.21859C1.99619 3.95838 1.85001 3.60546 1.85001 3.23748ZM11.1 32.375C11.1 33.111 10.8076 33.8168 10.2872 34.3372C9.76681 34.8576 9.06098 35.15 8.32501 35.15C7.58903 35.15 6.8832 34.8576 6.36278 34.3372C5.84237 33.8168 5.55001 33.111 5.55001 32.375C5.55001 31.639 5.84237 30.9332 6.36278 30.4128C6.8832 29.8923 7.58903 29.6 8.32501 29.6C9.06098 29.6 9.76681 29.8923 10.2872 30.4128C10.8076 30.9332 11.1 31.639 11.1 32.375ZM28.675 35.15C29.411 35.15 30.1168 34.8576 30.6372 34.3372C31.1576 33.8168 31.45 33.111 31.45 32.375C31.45 31.639 31.1576 30.9332 30.6372 30.4128C30.1168 29.8923 29.411 29.6 28.675 29.6C27.939 29.6 27.2332 29.8923 26.7128 30.4128C26.1924 30.9332 25.9 31.639 25.9 32.375C25.9 33.111 26.1924 33.8168 26.7128 34.3372C27.2332 34.8576 27.939 35.15 28.675 35.15Z" fill="black"/>
                    </svg>

                    <p style={epilogue.style} className='font-semibold text-black text-xl ml-4'>My Cart</p>
                </div>
            </div>    
            <Divider className='w-full' color="#474747"/>
        </main>
    );
}