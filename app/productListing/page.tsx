'use client'

import Footer from "@/components/Footer";
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