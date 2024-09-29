'use client'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductDetails from "@/components/ProductDetails";
import { MantineProvider, Paper } from "@mantine/core"

export default function ProductDetailsPage({ 
    params,
}: {
    params: { productModel: string };
}) {
    const productModel = decodeURIComponent(params.productModel);
    return(
        <MantineProvider>
            <Header navSelected="Catalogue"/>
            <Paper shadow="xl">
                <ProductDetails productModel={productModel}/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}