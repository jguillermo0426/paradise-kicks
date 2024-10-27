'use client'
import { SimpleGrid, MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GroupedProduct2, Product } from '@/types/types';
import { Card, CardBody, Image } from "@nextui-org/react";
import Link from 'next/link';



export default function ProductListing() {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct2[]>([]);
    const brandLogoMap: Map<string, string> = new Map();
    brandLogoMap.set("Nike", "/nike.png");
    brandLogoMap.set("Adidas", "/adidas.png");
    brandLogoMap.set("New Balance", "/new balance.png");

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

    const groupProducts = (products: Product[]) => {
        let modelId = 0;
        let colorwayId = 0;
        let sizeId = 0;

        const grouped: { [Model: string]: GroupedProduct2 } = {};
        products.forEach((product) => {
            const { SKU, Model, Brand, Colorway, Size, Stock, Price, image_link } = product;

            if(product.available){
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
                    colorwayGroup = { id: colorwayId, image_link: image_link, colorway: Colorway, sizes: [], model: Model, brand: Brand };
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
            }
            
        });      
        return Object.values(grouped);      
    }

    const getTotalStocks = (groupedProduct: GroupedProduct2) => {
        let totalStocks = 0;
        groupedProduct.colorways.forEach((colorway) => {
            colorway.sizes.forEach((size) => {
                totalStocks += size.stock;
            });
        });

        return totalStocks;
    }

    const getTotalColors = (groupedProduct: GroupedProduct2) => {
        let totalColors = 0;
        groupedProduct.colorways.forEach((colorway) => {
            totalColors += 1;
        });

        return totalColors;
    }

    const getLowestPrice = (groupedProduct: GroupedProduct2) => {
        let lowestPrice = groupedProduct.colorways[0].sizes[0].price;
        groupedProduct.colorways.forEach((colorway) => {
            for(let i = 0; i < colorway.sizes.length; i++) {
                if (lowestPrice > colorway.sizes[i].price) {
                    lowestPrice = colorway.sizes[i].price
                }
            }
        });

        return lowestPrice;
    }

    return (
        <MantineProvider>
            <div className="flex flex-col items-center m-20 relative z-50 mb-[18rem] bg-white overflow-x-hidden min-h-screen">
                <div className="flex flex-col items-start w-full">
                    <div className="w-full flex flex-row items-end justify-start ml-4">
                        <p className="text-[64px]" style={{ fontFamily: "EpilogueBold", letterSpacing: "-3px", marginRight: "10px" }}>Catalogue</p> 
                        <p className="text-[16px]" style={{ fontFamily: "EpilogueBold", letterSpacing: "-1px", marginRight: "auto", paddingBottom: "23px" }}>All items</p> 
                    </div>
                    <div className="w-full flex flex-wrap items-start justify-start">
                    {groupedProducts && 
                        groupedProducts.map((product, productIndex) => 
                            <Link key={productIndex} href={`/product-details/${product.model}`}>
                                <Card key={productIndex} className="w-full max-w-[300px] h-[488px] max-h-[488px] flex flex-col items-center border-[1px] border-black rounded-2xl mx-4 mb-8 p-8">
                                    <CardBody>
                                        <div className="flex flex-col items-center">
                                            <Image
                                                alt="Card background"
                                                className="object-cover rounded-xl"
                                                src={product.colorways[0].image_link
                                                    ? product.colorways[0].image_link
                                                    : "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png"
                                                }
                                                height={250}
                                                width={250} />
                                        </div>
                                        <div className="h-full flex flex-col items-between justify-between">
                                            <div className="flex flex-col items-start">
                                                <small className="mt-4 text-[14px] text-[#808080]" style={{ fontFamily: "Epilogue" }}>{getTotalColors(product)}
                                                    { getTotalColors(product) > 1 
                                                        ? " colors"
                                                        : " color"
                                                    } 
                                                </small>
                                                {/*product.colorways.map((colorway, colorwayIndex) => 
                                                    <small key={colorwayIndex} className="text-default-500">{colorway.colorway}</small>
                                                )*/}
                                                <p className="text-[16px]" style={{ fontFamily: "EpilogueSemiBold", letterSpacing: "-0.5px" }}>{product.model}</p>  
                                                <p className="text-[16px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px"  }}>&#8369; {getLowestPrice(product)}</p>
                                            </div>
                                            
                                            <div className="flex flex-row justify-between items-end">
                                                <p className="text-[16px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px"  }}>{getTotalStocks(product)} stocks left</p>
                                                <Image 
                                                    src={brandLogoMap.get(product.brand)}
                                                    height={26}/>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Link>
                    )}
                    </div>
                </div>
                
            </div>
        </MantineProvider>
    );
}
