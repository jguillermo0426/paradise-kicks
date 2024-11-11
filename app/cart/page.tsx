'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MantineProvider, Paper } from "@mantine/core"
import { CartProvider } from "@/utils/useCart";
import Cart from "@/components/Cart";

export default function ProductListingPage() {

    return(
        <MantineProvider>
            <CartProvider>
                <Header navSelected="Catalogue"/>
                <Paper shadow="xl">
                    <Cart/>
                </Paper>
                <Footer/>    
            </CartProvider>
        </MantineProvider>
    );
}