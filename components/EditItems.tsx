import { Product, GroupedProduct, CardProduct } from "@/types/types";
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
    const [editProducts, setEditProducts] = useState<GroupedProduct[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
    const [hasErrorsEdit, setHasErrorsEdit] = useState<boolean>(false);
    const [sortedProducts, setSortedProducts] = useState<GroupedProduct[]>([]);
    
    const handleEditChange = (updatedProduct: CardProduct) => {
        const updatedGroupProducts = editProducts.map((product) => {
            if (product.id === updatedProduct.modelId) {
                return {
                    ...product,
                    model: updatedProduct.model,
                    brand: updatedProduct.brand,
                    colorways: product.colorways.map((colorway) => {
                        if (colorway.id === updatedProduct.colorId) {
                            return {
                                ...colorway,
                                colorway: updatedProduct.colorway,
                                sizes: updatedProduct.sizes
                            }
                        }
                        return colorway;
                    })
                };
            }
            return product;
        });

        setEditProducts(updatedGroupProducts);
    }
    
    const sortByModel = (products: GroupedProduct[]) => {
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
    
    useEffect(() => {
        const sorted = sortByModel(editProducts);
        setSortedProducts(sorted);
    }, [editProducts])

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
            }
        }
    }


    // groups the products based on their model, colorway, and size/stock/price
    const groupProducts = (products: Product[]) => {
        let modelId = 0;
        let colorwayId = 0;
        let sizeId = 0;

        const grouped: { [Model: string]: GroupedProduct } = {};
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
                price: Price,
                image_link: image_link
            });
            sizeId += 1;
        });      
        return Object.values(grouped);      
    }

    const convertEditProducts = () => {
        const products: Product[] = [];
        sortedProducts.forEach((product) => {
            const { model, brand, colorways } = product;

            colorways.forEach((color) => {
                const { colorway, sizes } = color;

                sizes.forEach((shoeSize) => {
                    const { SKU, size, stock, price, image_link } = shoeSize;

                    const tempProduct: Product = {
                        SKU: SKU,
                        Model: model,
                        Brand: brand,
                        Stock: stock,
                        Price: price,
                        Size: size,
                        Colorway: colorway,
                        image_link: image_link,
                        available: true
                    };

                    products.push(tempProduct);
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
                setEditProducts(products);
                console.log(products);
            }
        }
        getProduct();
    }, [groupedProducts]);

    return(
        <div className='w-full flex flex-col items-center justify-center'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {sortedProducts &&
                            sortedProducts.map((product, productIndex) =>
                            product.colorways.map((colorway, colorwayIndex) => (
                                <InventoryCard
                                    key={`${productIndex}-${colorwayIndex}`} // Unique key using product and colorway index
                                    cardProduct={{
                                        modelId: product.id,
                                        model: product.model,
                                        brand: product.brand,
                                        colorId: colorway.id,
                                        colorway: colorway.colorway,
                                        sizes: colorway.sizes,
                                    }}
                                    onChange={handleEditChange}
                                    editable={true}
                                    setHasErrors={setHasErrorsEdit}
                                />
                            ))
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