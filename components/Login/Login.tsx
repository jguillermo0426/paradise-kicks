
'use client'
import { FormEventHandler, useState } from "react";
import { useReducedMotion } from 'framer-motion';
import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Image, PasswordInput, TextInput, Button } from '@mantine/core';
import { Notifications, showNotification } from '@mantine/notifications';
import { Epilogue } from 'next/font/google';


const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
  
    const envUsername = process.env.NEXT_PUBLIC_USERNAME;
    const envPassword = process.env.NEXT_PUBLIC_PASSWORD;
    const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value);
    };

    const logIn: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (username === envUsername && password === envPassword) {
            Cookies.set("loggedin", "true", { expires: 1 / 24 });
            router.push("/admin-dashboard/inventory");
        }
        else {
            showNotification({
                title: 'Login Failed',
                message: 'Invalid username or password',
            });
        }
    }
    
    return (
        <main>
            <div className="flex flex-row w-full items-center justify-center" style={{ height: "100vh" }}>
                <div className="flex flex-col items-center h-full justify-center p-20">
                    <div className="flex flex-col items-center justify-start  drop-shadow-xl w-[600px] h-full py-10 bg-[#319694]" style={{ paddingInline: "100px", borderRadius: "20px" }}>
                        <Image
                            src="/white logo.png"
                            h={80}
                            w={80}
                        />
                        <p style={epilogue.style} className="text-[45px] font-bold text-[#EDEDED] mt-5 mb-0">Paradise Kicks</p>
                        <p style={epilogue.style} className="text-[13px] font-light italic text-[#EDEDED] mb-5">Please enter your admin login credentials.</p>
                        
                        {/* LOG IN FORM */}
                        <form onSubmit={(e) => logIn(e)} id="login-form" className="flex flex-col w-9/12 items-start justify-center">
                            <p style={epilogue.style} className="text-[15px] font-light text-[#EDEDED]">
                                Username<span style={{ color: "#E53835", fontSize: "20px" }}>*</span>
                            </p>
                            <TextInput 
                                name="username"
                                value={username}
                                onChange={handleUsernameChange}
                                className="w-full rounded-md p-1 mt-1 mb-4"
                                required
                            />
                            <p style={epilogue.style} className="text-[15px] font-light text-[#EDEDED]">
                                Password<span style={{ color: "#E53835", fontSize: "20px" }}>*</span>
                            </p>
                            <PasswordInput 
                                name="username"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full rounded-md p-1 mt-1 mb-4"
                                required
                            />
                            <Button 
                                fullWidth
                                className="mt-4 p-1" 
                                type="submit"
                                styles={{
                                    root: {
                                        backgroundColor: "#38bdba"
                                    }
                                }}
                            >
                                <p style={epilogue.style} > 
                                    
                                    Log In
                                </p>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <Notifications />
        </main>
    );
}