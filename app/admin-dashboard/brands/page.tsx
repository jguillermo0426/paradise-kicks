'use client'

import AdminHeader from "@/components/AdminHeader";
import Brands from "@/components/Brands/Brands";
import Footer from "@/components/Footer";
import { MantineProvider, Paper } from "@mantine/core"

export default function Inventory() {

    return (
        <MantineProvider>
            <AdminHeader navSelected="Brands"></AdminHeader>
            <Paper shadow="xl">
                <Brands></Brands>
            </Paper>
            
        </MantineProvider>
    );
}