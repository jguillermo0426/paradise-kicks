'use client'

import AdminStock from "@/components/AdminStock";
import Footer from "@/components/Footer";
import ProductDetails from "@/components/ProductDetails";
import ProductListing from "@/components/ProductListing";
import { MantineProvider, Paper } from "@mantine/core"

export default function ProductListingPage() {

    return(
        <MantineProvider>
            <Paper shadow="xl">
                <ProductListing/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}