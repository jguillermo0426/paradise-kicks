'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductDetails from "@/components/ProductDetails";
import { MantineProvider, Paper } from "@mantine/core";
import { CartProvider } from "@/utils/useCart";

export default function ProductDetailsPage({ 
    params,
}: {
    params: { productModel: string };
}) {
    return(
        <MantineProvider>
            <CartProvider>
            <Header navSelected="Catalogue"/>
            <Paper shadow="xl">
                <ProductDetails productModel={params.productModel}/>
            </Paper>
            <Footer/>
            </CartProvider>
        </MantineProvider>
    );
}