'use client'
import '@mantine/notifications/styles.css';
import Login from "@/components/Login/Login";
import { MantineProvider } from "@mantine/core";

const Loginpage = () => {
    return (
        <>
            <MantineProvider>
                <Login />
            </MantineProvider>
        </>
    );
}

export default Loginpage;