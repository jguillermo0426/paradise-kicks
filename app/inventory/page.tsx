'use client'

import AdminStock from "@/components/AdminStock";
import Footer from "@/components/Footer";
import { MantineProvider, Paper } from "@mantine/core"

export default function Inventory() {

    return(
        <MantineProvider>
            <Paper shadow="xl">
                <AdminStock/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}