'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTracker from "@/components/OrderTracker/OrderTracker";
import { CartProvider } from "@/utils/useCart";
import { MantineProvider, Paper } from "@mantine/core"

export default function OrderTrackerPage() {

    return (
        <MantineProvider>
            <CartProvider>
                <Header navSelected="" />
                <Paper shadow="xl">
                    <OrderTracker />
                </Paper>
                <Footer />
            </CartProvider>
        </MantineProvider>
    );
}