'use client'

import Footer from "@/components/Footer";
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
            <Paper shadow="xl">
                <ProductDetails productModel={productModel}/>
            </Paper>
            <Footer/>
        </MantineProvider>
    );
}