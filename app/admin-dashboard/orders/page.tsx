'use client'

import AdminHeader from "@/components/AdminHeader";
import Orders from "@/components/Status/Orders";
import { MantineProvider, Paper } from "@mantine/core";

export default function Inventory() {

    return(
        <MantineProvider>
            <AdminHeader navSelected="Orders"/>
            <Paper shadow="">
                <Orders/>
            </Paper>
            
        </MantineProvider>
    );
}