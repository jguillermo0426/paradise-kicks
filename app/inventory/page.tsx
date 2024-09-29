'use client'

import AdminStock from "@/components/AdminStock";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MantineProvider, Paper } from "@mantine/core"

export default function Inventory() {

    return(
        <MantineProvider>
            <Header navSelected="None"/>
            <Paper shadow="xl">
                <AdminStock/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}