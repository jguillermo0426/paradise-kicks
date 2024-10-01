import { Product, GroupedProduct, CardProduct, Colorway, GroupedColor } from "@/types/types";
import { Button, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect } from "react";
import InventoryCard from "./InventoryCard";

type editItemProps = {
    onSuccess: () => void
}

export default function EditItems({onSuccess}: editItemProps) {
    // setting up product variables
    const [editProductData, setEditProductData] = useState<Product[]>([]);
    const [editProducts, setEditProducts] = useState<GroupedColor[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<GroupedColor[]>([]);
    
    const handleEditChange = (updatedProduct: CardProduct) => {
        const updatedGroupProducts = editProducts.map((product) => {
            if (product.id === updatedProduct.colorId) {
                return {
                    ...product,
                    model: updatedProduct.model,
                    brand: updatedProduct.brand,
                    colorway: updatedProduct.colorway,
                    sizes: updatedProduct.sizes
                };
            }
            return product;
        });

        setEditProducts(updatedGroupProducts);
    }

    
    const sortByModel = (products: GroupedColor[]) => {
        return products.sort((a, b) => {
            if (a.model < b.model) {
                return -1;
            } else if (a.model > b.model) {
                return 1;
            } else {
                return 0;
            }
        });
    };
    

    // edit Products
    const updateProducts = async () => {
        //setSuccessUpload(false);
        if (editProductData.length > 0) {
            const response = await fetch('/api/product/edit_product', {
                method: "POST",
                body: JSON.stringify(editProductData)
            });

            const result = await response.json();
            console.log(result);

            if (result) {
                onSuccess();
                //setSuccessUpload(true);
                setGroupedProducts([]);
                setEditProducts(sortByModel(groupedProducts));
            }
        }
    }


    // groups the products based on their model, colorway, and size/stock/price
    const groupProducts = (products: Product[]) => {
        let colorwayId = 0;
        let sizeId = 0;

        // Create a map to store grouped products by colorway
        const groupedColorsMap: { [colorway: string]: GroupedColor } = {};

        products.forEach(product => {
            const { SKU, Model, Brand, Colorway, Size, Stock, Price, image_link } = product;

            // Check if the colorway already exists in the map
            if (!groupedColorsMap[Colorway]) {
                groupedColorsMap[Colorway] = {
                    id: colorwayId++, // Increment unique colorway ID
                    colorway: Colorway,
                    model: Model,
                    brand: Brand,
                    sizes: []
                };
            }

            // Add the size information to the respective colorway
            groupedColorsMap[Colorway].sizes.push({
                id: sizeId++,  // Increment unique size ID
                SKU: SKU,
                size: Size,
                stock: Stock,
                price: Price,
                image_link: image_link
            });
        });

        // Convert the grouped colorways map into an array
        return Object.values(groupedColorsMap);    
    }


    const convertEditProducts = () => {
        const products: Product[] = [];

        editProducts.forEach(groupedColor => {
            const { model, brand, colorway, sizes } = groupedColor;

            // Iterate through the sizes array and create a product for each size
            sizes.forEach(size => {
                products.push({
                    SKU: size.SKU,
                    Model: model,
                    Brand: brand,
                    Stock: size.stock,
                    Price: size.price,
                    Size: size.size,
                    Colorway: colorway,
                    image_link: size.image_link,
                    available: size.stock > 0 // You can determine availability based on stock or another logic
                });
            });
        });

        setEditProductData(products);
    }

    useEffect(() => {
        convertEditProducts();
        //console.log(productData);
    }, [editProducts]);

    
    useEffect(() => {
        const getProduct = async() => {
            const response = await fetch('/api/product/get_product', {
                method: "GET"
            })
    
            const result = await response.json();
            console.log(result.product);
            if (result.product.length != 0) {
                const products = groupProducts(result.product);
                setEditProducts(sortByModel(products));
            }
        }
        getProduct();
    }, [groupedProducts]);

    return(
        <div className='w-full flex flex-col items-center justify-center'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {editProducts &&
                        editProducts.map((product) =>
                            <InventoryCard
                                key={`${product.id}`} // Unique key using product and colorway index
                                cardProduct={{
                                    model: product.model,
                                    brand: product.brand,
                                    colorId: product.id,
                                    colorway: product.colorway,
                                    sizes: product.sizes,
                                }}
                                onChange={handleEditChange}
                                editable={true}
                            />  
                    )}
                </div>

                <Button className='mt-8'
                        onClick={updateProducts}
                        styles = {{
                            root: {
                                backgroundColor: "#38BDBA",
                                color: "white",
                                width: '10vw',
                            }
                        }}
                    >
                        Save Edited Items
                    </Button>
            </div>
    );
}