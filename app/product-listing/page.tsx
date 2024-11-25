'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductListing from "@/components/ProductListing";
import { CartProvider } from "@/utils/useCart";
import { MantineProvider, Paper } from "@mantine/core"

export default function ProductListingPage() {

    return(
        <MantineProvider>
            <CartProvider>
            <Header navSelected="Catalogue"/>
            <Paper shadow="xl">
                <ProductListing searchParams={""}/>
            </Paper>
            <Footer/>
            </CartProvider>
        </MantineProvider>
    );
}