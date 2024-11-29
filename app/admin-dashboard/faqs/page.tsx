'use client'

import AdminHeader from "@/components/AdminHeader";
import FAQs from "@/components/FAQs/FAQs";
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