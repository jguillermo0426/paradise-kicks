'use client'
import { SimpleGrid, MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GroupedProduct, Product } from '@/types/types';
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import Link from 'next/link';



export default function ProductListing() {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);

    useEffect(() => {
        const getProducts = async() => {
            const response = await fetch('api/product/get_product', {
                method: "GET"
            })

            const result = await response.json();
            console.log(result.product);
            if (result.product.length != 0) {
                const products = groupProducts(result.product);
                setGroupedProducts(products);
                console.log(products);
            }
        }
        getProducts();
    }, []);


    // groups the products based on their model, colorway, and size/stock/price
    const groupProducts = (products: Product[]) => {
        let modelId = 0;
        let colorwayId = 0;
        let sizeId = 0;

        const grouped: { [Model: string]: GroupedProduct } = {};
        products.forEach((product) => {
            const { SKU, Model, Brand, Colorway, Size, Stock, Price } = product;

            // initialize the model if it doesnt exist
            if (!grouped[Model]) {
                grouped[Model] = {
                    id: modelId,
                    model: Model,
                    brand: Brand,
                    colorways: []
                };   
                
                modelId += 1;
            };
            
            // find the shoe of the same brand with matching colorway
            let colorwayGroup = grouped[Model].colorways.find(shoe => shoe.colorway === Colorway);
            // if the group of the colorways doesnt exist, create it
            if (!colorwayGroup) { 
                colorwayGroup = { id: colorwayId, colorway: Colorway, sizes: [] };
                grouped[Model].colorways.push(colorwayGroup);
                colorwayId += 1;
            }

            // assign the individual sku, size, stock, and price for the shoe
            colorwayGroup.sizes.push({
                id: sizeId,
                SKU: SKU,
                size: Size,
                stock: Stock,
                price: Price 
            });
            sizeId += 1;
        });      
        return Object.values(grouped);      
    }

    const getTotalStocks = (groupedProduct: GroupedProduct) => {
        let totalStocks = 0;
        groupedProduct.colorways.forEach((colorway) => {
            colorway.sizes.forEach((size) => {
                totalStocks += size.stock;
            });
        });

        return totalStocks;
    }

    return (
        <MantineProvider>
            <div className='flex flex-col items-center m-4 relative z-50 mb-[18rem] bg-white overflow-hidden min-h-screen'>
                <p>Products</p>
                <SimpleGrid cols={3} spacing="xl">
                {groupedProducts && 
                    groupedProducts.map((product, productIndex) => 
                        <Link key={productIndex} href={`/productListing/${product.model}`}>
                            <Card key={productIndex} className="py-4">
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                    <h4 className="font-bold text-large">{product.model}</h4>
                                    <small className="text-default-500">{getTotalStocks(product)} stocks left</small>
                                </CardHeader>
                                <CardBody className="overflow-visible py-2">
                                    <Image
                                        alt="Card background"
                                        className="object-cover rounded-xl"
                                        src="https://scontent.fmnl33-5.fna.fbcdn.net/v/t39.30808-6/461207543_1030666055735889_1571487299371181397_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=3a46pwS16UkQ7kNvgHyeFjq&_nc_ht=scontent.fmnl33-5.fna&_nc_gid=AcZyBKDo2yuPjFPjF11AMsx&oh=00_AYBQ8dN43ENeQq7pYdTwsbC_VfXSAJtTqH4s17Dotdp79w&oe=66FE0842"
                                        width={270} />
                                <p className="text-tiny font-bold">Colors: </p>
                                {product.colorways.map((colorway, colorwayIndex) => 
                                    <small key={colorwayIndex} className="text-default-500">{colorway.colorway}</small>
                                )}
                                </CardBody>
                            </Card>
                        </Link>
                )}
                </SimpleGrid>
            </div>
        </MantineProvider>
    );
}
