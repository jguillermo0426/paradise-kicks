'use client'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SetStatus from "@/components/SetStatus";
import { MantineProvider, Paper } from "@mantine/core"

export default function Inventory() {

    return(
        <MantineProvider>
            <Header navSelected="None"/>
            <Paper shadow="xl">
                <SetStatus/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}