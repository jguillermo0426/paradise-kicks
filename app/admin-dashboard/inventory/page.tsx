'use client'

import AdminHeader from "@/components/AdminHeader";
import AdminStock from "@/components/AdminStock";
import Footer from "@/components/Footer";
import { MantineProvider, Paper } from "@mantine/core"

export default function Inventory() {

    return(
        <MantineProvider>
            <AdminHeader navSelected="Inventory"/>
            <Paper shadow="xl">
                <AdminStock/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}