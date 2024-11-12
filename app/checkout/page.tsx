'use client'
import Footer from "@/components/Footer";
import Checkout from "@/components/Checkout/Checkout";
import { CartProvider } from "@/utils/useCart";
import { MantineProvider, Paper } from "@mantine/core"

export default function ProductListingPage() {

    return (
        <MantineProvider>
            <CartProvider>
                <Paper shadow="xl">
                    <Checkout />
                </Paper>
                <Footer />
            </CartProvider>
        </MantineProvider>
    );
}