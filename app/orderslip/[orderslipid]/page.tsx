'use client'
import Footer from "@/components/Footer";
import OrderSlip from "@/components/OrderSlip/OrderSlip";
import { CartProvider } from "@/utils/useCart";
import { MantineProvider, Paper } from "@mantine/core"
import { use } from "react";


export default function OrderslipPage ({ params }: {params: Promise<{orderslipid: string}>}) {
    const { orderslipid } = use(params);

    return (
        <MantineProvider>
            <CartProvider>
                <Paper shadow="xl">
                    <OrderSlip orderslipid={orderslipid}/>
                </Paper>
                <Footer />
            </CartProvider>
        </MantineProvider>
    );
}
