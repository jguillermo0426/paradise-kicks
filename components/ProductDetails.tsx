'use client'
import { MantineProvider} from '@mantine/core';
import { useEffect, useState } from 'react';
import { GroupedProduct2, Product } from '@/types/types';
import { Image, Divider, Button } from "@nextui-org/react";

type ProductProps = {
    productModel: string;
}

export default function ProductDetails({productModel}: ProductProps) {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct2[]>([]);
    const [size, setSize] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [product, setProduct] = useState<Product>();
    const [SKU, setSKU] = useState<string>('');
    const [stock, setStock] = useState<number>(0);

    const buttonStyles = {
        selected:{
          border: "2px solid black"
        },
        unselected:{
            border: "1px solid gray",
        }
    };

    
    useEffect(() => {
        const getModel = async() => {
            const response = await fetch(`/api/product/get_model?model=${productModel}`, {
                method: "GET"
            });

            const result = await response.json();
            console.log(result.model);
            if (result.model.length != 0) {
                const product = groupProducts(result.model);
                setGroupedProducts(product);
                console.log(product);
            }
            else {
                console.log(productModel + "not found")
            }
        }
        getModel();
    }, []);
    

    // groups the products based on their model, colorway, and size/stock/price
    const groupProducts = (products: Product[]) => {
        let modelId = 0;
        let colorwayId = 0;
        let sizeId = 0;

        const grouped: { [Model: string]: GroupedProduct2 } = {};
        products.forEach((product) => {
            const { SKU, Model, Brand, Colorway, Size, Stock, Price, image_link } = product;

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

    const getHighestPrice = (groupedProduct: GroupedProduct2) => {
        let highestPrice = groupedProduct.colorways[0].sizes[0].price;
        groupedProduct.colorways.forEach((colorway) => {
            for(let i = 0; i < colorway.sizes.length; i++) {
                if (highestPrice < colorway.sizes[i].price) {
                    highestPrice = colorway.sizes[i].price
                }
            }
        });

        return highestPrice;
    }

    const handleChange = (product: GroupedProduct2, sku: string) => {
        product.colorways.forEach((colorway) => {
            for(let i = 0; i < colorway.sizes.length; i++) {
                if (sku === colorway.sizes[i].SKU) {
                    setPrice(colorway.sizes[i].price);
                    setSKU(sku);
                    setStock(colorway.sizes[i].stock);
                }
            }
        });
    }

    const startingPriceDisplay = (product: GroupedProduct2) => {
        let lowestPrice = getLowestPrice(product);
        let highestPrice = getHighestPrice(product);

        if(lowestPrice === highestPrice){
            return `₱${lowestPrice.toString()}`;
        }
        else{
            return `₱${lowestPrice.toString()} - ₱${highestPrice.toString()}`;
        }
    }


    return (
        <MantineProvider>
            <div className='flex flex-col items-center m-4 relative z-50 mb-[18rem] bg-white overflow-hidden min-h-screen'>
                {groupedProducts && 
                    groupedProducts.map((product, productIndex) => 
                        <div key={productIndex} className="flex flex-row justify-center w-[90%] mx-4 my-10">
                            <div className="flex flex-col items-center w-[65%] max-w-[724px] mx-2">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl"
                                    src={product.colorways[0].image_link
                                        ? product.colorways[0].image_link
                                        : "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png"
                                    }
                                    width={724}
                                    height={764}
                                    />
                            </div>
                            <div className="flex flex-col w-[35%] justify-start ml-6 mx-4">
                                <p className="text-[16px] text-[#474747]" style={{ fontFamily: "Epilogue" }}>
                                    {SKU === ''
                                        ? getTotalStocks(product)
                                        : stock
                                    } stocks left
                                </p>
                                <p className="text-[50px]" style={{ fontFamily: "EpilogueBold", letterSpacing: "-3px", marginTop: "-6px", marginBottom: "-14px" }}>{product.model}</p>
                                <p className="text-[20px]" style={{ fontFamily: "EpilogueMedium" }}>
                                    {SKU === ''
                                        ? `${startingPriceDisplay(product)}`
                                        : `₱${price.toString()}`
                                    }
                                </p>
                                {product.colorways.map((colorway, colorwayIndex) =>
                                    <p key={colorwayIndex} className="text-[16px] text-[#474747]" style={{ fontFamily: "Epilogue" }}>{colorway.colorway}</p>
                                )} 
                                <Divider className="my-2" />
                                <p className="text-[18px]" style={{ fontFamily: "Epilogue", letterSpacing: "-1px" }}>Size</p>                          
                                <div className="w-full flex flex-wrap items-center justify-start">
                                    {product.colorways.map((colorway) =>
                                        colorway.sizes.map((size, sizeIndex) => (
                                            <Button key={sizeIndex} onClick={() => handleChange(product, size.SKU)} className="w-[110px] h-[58px] flex flex-col items-center justify-center mr-2 mb-2 rounded-md" style={size.SKU === SKU ? buttonStyles.selected : buttonStyles.unselected}>
                                                <p className="text-[16px]" style={{ fontFamily: "Epilogue" }}>{size.size}</p>
                                            </Button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </MantineProvider>
    );
}
