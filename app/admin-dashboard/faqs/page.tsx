'use client'

import AdminHeader from "@/components/AdminHeader";
import FAQs from "@/components/FAQs/FAQs";
import Footer from "@/components/Footer";
import { MantineProvider, Paper } from "@mantine/core"

export default function faqs() {

    return (
        <MantineProvider>
            <AdminHeader navSelected="FAQs"></AdminHeader>
            <Paper shadow="">
                <FAQs></FAQs>
            </Paper>
        </MantineProvider>
    );
}