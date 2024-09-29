'use client'
import { MantineProvider} from '@mantine/core';
import { useEffect, useState } from 'react';
import { GroupedProduct, Product } from '@/types/types';

type ProductProps = {
    productModel: string;
}

export default function ProductDetails({productModel}: ProductProps) {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);

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

    /*
    const getTotalStocks = (groupedProduct: GroupedProduct) => {
        let totalStocks = 0;
        groupedProduct.colorways.forEach((colorway) => {
            colorway.sizes.forEach((size) => {
                totalStocks += size.stock;
            });
        });

        return totalStocks;
    }
    */

    return (
        <MantineProvider>
            <div className='flex flex-col items-center m-4 relative z-50 mb-[18rem] bg-white overflow-hidden min-h-screen'>
                <h4 className="font-bold text-large">{productModel}</h4>
                <p className="font-bold">Colorways: </p>
                {groupedProducts && 
                    groupedProducts.map((product) => 
                        product.colorways.map((colorway, colorwayIndex) => 
                            <div key={colorwayIndex} className='flex flex-col justify-left'>
                                <p className="font-bold" key={colorwayIndex}>{colorway.colorway}</p>
                                <p>Available Sizes:</p>
                                {colorway.sizes.map((size, sizeIndex) =>
                                    <p key={sizeIndex}>{size.size} - {size.stock} stocks - P{size.price}</p>
                                )}
                            </div>
                        )
                    )
                }
            </div>
        </MantineProvider>
    );
}
