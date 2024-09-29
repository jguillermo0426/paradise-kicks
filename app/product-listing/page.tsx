'use client'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductListing from "@/components/ProductListing";
import { MantineProvider, Paper } from "@mantine/core"

export default function ProductListingPage() {

    return(
        <MantineProvider>
            <Header navSelected="Catalogue"/>
            <Paper shadow="xl">
                <ProductListing/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}