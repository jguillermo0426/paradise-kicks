'use client'

import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import Orders from "@/components/Status/Orders";
import { MantineProvider, Paper } from "@mantine/core"

export default function Inventory() {

    return(
        <MantineProvider>
            <AdminHeader navSelected="Orders"/>
            <Paper shadow="xl">
                <Orders/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}