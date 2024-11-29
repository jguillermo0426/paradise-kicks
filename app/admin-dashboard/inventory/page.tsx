'use client'

import AdminHeader from "@/components/AdminHeader";
import AdminStock from "@/components/Inventory/AdminStock";
import { MantineProvider, Paper } from "@mantine/core";

export default function Inventory() {

    return(
        <MantineProvider>
            <AdminHeader navSelected="Inventory"/>
            <Paper shadow="">
                <AdminStock/>
            </Paper>
            
        </MantineProvider>
    );
}