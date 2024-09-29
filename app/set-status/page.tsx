'use client'

import Footer from "@/components/Footer";
import SetStatus from "@/components/SetStatus";
import { MantineProvider, Paper } from "@mantine/core"

export default function Inventory() {

    return(
        <MantineProvider>
            <Paper shadow="xl">
                <SetStatus/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}