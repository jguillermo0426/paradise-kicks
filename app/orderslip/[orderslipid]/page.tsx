'use client'
import Footer from "@/components/Footer";
import OrderSlip from "@/components/OrderSlip/OrderSlip";
import { CartProvider } from "@/utils/useCart";
import { MantineProvider, Paper } from "@mantine/core"

export default function ProductListingPage({ params }: { params: { orderslipid: string } }) {

    return (
        <MantineProvider>
            <CartProvider>
                <Paper shadow="xl">
                    <OrderSlip orderslipid={params.orderslipid}/>
                </Paper>
                <Footer />
            </CartProvider>
        </MantineProvider>
    );
}