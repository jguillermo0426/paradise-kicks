import { Product, CardProduct, GroupedProduct2 } from "@/types/types";
import { Button, Pagination } from "@mantine/core";
import { useState, useEffect } from "react";
import InventoryCard from "./InventoryCard";
import classes from '../css/tabs.module.css';
import { storage } from "@/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type editItemProps = {
    onSuccess: () => void
}

export default function EditItems({onSuccess}: editItemProps) {
    // setting up product variables
    const [editProductData, setEditProductData] = useState<Product[]>([]);
    const [editProducts, setEditProducts] = useState<GroupedProduct2[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct2[]>([]);
    const [hasErrorsEdit, setHasErrorsEdit] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [activePage, setPage] = useState(1);
    
    const handleEditChange = (updatedProduct: CardProduct) => {
        const updatedGroupProducts = editProducts.map((product) => {   
            const updatedColorways = product.colorways.map((colorway) => {
                
                const currentCardId = `${product.id}-${colorway.id}`;
    
                if (currentCardId === updatedProduct.cardId) {
                    return {
                        ...colorway,
                        colorway: updatedProduct.colorway,
                        model: updatedProduct.model,
                        brand: updatedProduct.brand,
                        image_file: updatedProduct.image_file,
                        sizes: updatedProduct.sizes, 
                    };
                }
                return colorway;
            });
    
            if (product.id === updatedProduct.modelId) {
                return {
                    ...product,
                    model: updatedProduct.model,
                    brand: updatedProduct.brand,
                    colorways: updatedColorways,
                };
            }
            return product;
        });
    
        setEditProducts(updatedGroupProducts);
    };
    
    const sortByModel = (products: GroupedProduct2[]) => {
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
        const productData = await convertEditProducts();
        if (productData.length > 0) {
            const response = await fetch('/api/product/edit_product', {
                method: "POST",
                body: JSON.stringify(productData)
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

    const convertEditProducts = async () => { // Make this function async
        const products: Product[] = [];
        for (const product of editProducts) {
            const { model, brand, colorways } = product;
    
            for (const color of colorways) {
                const { colorway, sizes, image_file } = color;
    
                let image_link = "";
                if (image_file) {
                    const filename = `${colorway}-${model}`;
                    const storageRef = ref(storage, `images/${filename}`);
                    try {
                        await uploadBytes(storageRef, image_file);
                        image_link = await getDownloadURL(storageRef);
                        console.log('File uploaded successfully! URL: ', image_link);
                    } catch (error) {
                        console.error("Error uploading file: ", error);
                        alert('File upload failed.');
                    }
                }
    
                for (const shoeSize of sizes) {
                    const { SKU, size, stock, price } = shoeSize;
    
                    const tempProduct: Product = {
                        SKU: SKU,
                        Model: model,
                        Brand: brand,
                        Stock: stock,
                        Price: price,
                        Size: size,
                        Colorway: colorway,
                        image_link: image_link, // Use the image_link from the upload
                        available: true
                    };
    
                    products.push(tempProduct);
                }
            }
        }
    
        return products;
    }
    

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

    
    useEffect(() => {
        const getProduct = async() => {
            const response = await fetch(`/api/product/get_products?page=${activePage}`, {
                method: "GET"
            })
    
            const result = await response.json();
            console.log(result);
            if (result.products.length != 0) {
                const products = groupProducts(result.products);
                setEditProducts(sortByModel(products));
                setTotalPages(Math.ceil(result.totalProducts/12));
            }
        }
        getProduct();
    }, [groupedProducts, activePage]);

    return(
        <div className='w-full flex flex-col items-center justify-center'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {editProducts &&
                    editProducts.map((product, productIndex) =>
                    product.colorways.map((colorway, colorwayIndex) => (
                        <InventoryCard
                            key={`${productIndex}-${colorwayIndex}`} // Unique key using product and colorway index
                            cardProduct={{
                                cardId: `${product.id}-${colorway.id}`,
                                modelId: product.id,
                                model: colorway.model,
                                brand: colorway.brand,
                                colorId: colorway.id,
                                colorway: colorway.colorway,
                                sizes: colorway.sizes,
                                image_file: colorway.image_file,
                                image_link: colorway.image_link
                            }}
                            onChange={handleEditChange}
                            setHasErrors={setHasErrorsEdit}
                        />
                    ))
                )}
            </div>

            <Pagination 
                value={activePage} 
                total={totalPages} 
                onChange={(page) => {{
                    setPage(page);
                    window.scrollTo(0,0);
                }}} 
                classNames={{
                    root: classes.pageRoot
                }}
            />
            
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