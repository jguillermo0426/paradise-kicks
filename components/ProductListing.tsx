'use client'
import { MantineProvider, Select, TextInput, Popover, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GroupedProduct2, Product } from '@/types/types';
import { Card, CardBody, Image } from "@nextui-org/react";
import Link from 'next/link';
import React from 'react';



export default function ProductListing() {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct2[]>([]);
    const brandLogoMap: Map<string, string> = new Map();
    brandLogoMap.set("Nike", "/nike.png");
    brandLogoMap.set("Adidas", "/adidas.png");
    brandLogoMap.set("New Balance", "/new balance.png");

    const sorting = [
        {label: "A-Z", key: "A-Z" },
        {label: "Price: Highest to Lowest", key: "Price: Highest to Lowest" },
        {label: "Price: Lowest to HighestHighest to Lowest", key: "Price: Lowest to Highest" }
    ]

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

    const animals = ["dog", "cat"]

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
                <div className="flex flex-col items-center w-full max-w-[1440px] m-6">
                    <div className="w-full flex flex-row items-end justify-between mb-8 px-12">
                        <div className="w-full flex flex-row items-end justify-start">
                            <p className="text-[100px]" style={{ fontFamily: "EpilogueBold", letterSpacing: "-3px", marginRight: "20px", marginBottom: "-36px" }}>Catalogue</p> 
                            <p className="text-[24px]" style={{ fontFamily: "EpilogueBold", marginRight: "auto" }}>All items</p> 
                        </div>

                        <div className="w-full flex flex-row items-end justify-end">
                            <Popover width={200} position="bottom" withArrow shadow="md">
                                <Popover.Target>
                                    <Button 
                                    color="black"
                                    styles={{
                                        label: {
                                            fontFamily: "EpilogueThin"
                                        },
                                        root: {
                                            width: "150px",  
                                            height: "35px",  
                                            borderRadius: "6px",
                                            marginRight: "20px"
                                        },
                                    }}
                                    >
                                    Filter/Sort
                                    </Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Select
                                    placeholder="Select filter"
                                    data={['Alphabetical', 'Price: Lowest to Highest', 'Price: Highest to Lowest']}
                                    comboboxProps={{ withinPortal: false }}
                                    styles={{
                                        input: {
                                            fontFamily: "Epilogue"
                                        },
                                        option: {
                                            fontFamily: "Epilogue"
                                        }
                                    }}
                                    />
                                </Popover.Dropdown>
                            </Popover>

                            <TextInput
                                placeholder="Search"
                                styles={{
                                    input: {
                                        fontFamily: "Epilogue",
                                        height: "45px",
                                        width: "250px",  
                                    }
                                }}
                            />   
                        </div>       
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20 justify-start">
                    {groupedProducts && 
                        groupedProducts.map((product, productIndex) => 
                            <Link key={productIndex} href={`/product-details/${product.model}`}>
                                <Card key={productIndex} className="max-w-[300px] h-[450px] flex flex-col items-center border-[1px] border-black rounded-2xl p-8">
                                    <CardBody className="flex flex-col justify-between h-full">
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
                                        <div className="w-full h-full flex flex-col items-start justify-between">
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
                                                <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px"  }}>&#8369; {getLowestPrice(product).toFixed(2)}</p>
                                            </div>

                                            <div className="w-full flex flex-row items-end justify-between mt-4">
                                                <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px"  }}>{getTotalStocks(product)} stocks left</p>
                                                <Image 
                                                    src={brandLogoMap.get(product.brand)}
                                                    height={28}
                                                />
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
