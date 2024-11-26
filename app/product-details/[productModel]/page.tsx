'use client';

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductDetails from "@/components/ProductDetails";
import { MantineProvider, Paper } from "@mantine/core";
import { CartProvider } from "@/utils/useCart";

type Params = Promise<{ productModel: string }>;

export default async function ProductDetailsPage({
    params,
}: {
    params: Params;
}) {
    const { productModel } = await params;

    return (
        <MantineProvider>
            <CartProvider>
                <Header navSelected="Catalogue" />
                <Paper shadow="xl">
                    <ProductDetails productModel={productModel} />
                </Paper>
                <Footer />
            </CartProvider>
        </MantineProvider>
    );
}
