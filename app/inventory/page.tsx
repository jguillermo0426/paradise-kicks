'use client'
import { useForm } from '@mantine/form';
import { MantineProvider, TextInput, Button, NumberInput, FileButton, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CardProduct, GroupedProduct, Product } from '@/types/types';
import { Notifications, showNotification } from '@mantine/notifications';
import Papa from 'papaparse';
import CardTest from '@/components/CardTest';

// file input will only accept .csv files
const acceptableCSVFileTypes = ".csv";

export default function Inventory() {

    // setting up product variables
    const [productData, setProductData] = useState<Product[]>([]);
    const [editProductData, setEditProductData] = useState<Product[]>([]);
    const [editProducts, setEditProducts] = useState<GroupedProduct[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
    const [hasErrors, setHasErrors] = useState<boolean>(false);
    const [hasErrorsEdit, setHasErrorsEdit] = useState<boolean>(false);

    // initialize the form for single submission
    const productForm = useForm({
        initialValues: {
            SKU: "",
            Model: "",
            Brand: "",
            Stock: 0,
            Price: 0.00,
            Size: "",
            Colorway: ""
        }
    });
    

    // when file is uploaded, parse its data
    const onFileChangeHandler = (event: File | null) => {
        // set the displayed data to reset when a file is not chosen
        setProductData([]);
        setGroupedProducts([]);
        if (event) {
            const csvFile = event;

            // parse data from csv file into object
            Papa.parse<Product>(csvFile, {
                skipEmptyLines: true,
                header: true,
                complete: function(results) {
                    console.log("Finished:", results.data);
                    const products: Product[] = results.data;
                    const grouped = groupProducts(products);
                    setProductData(products);
                    setGroupedProducts(grouped);
                    console.log(grouped);
                }
            });
        }
    }

    const handleChange = (updatedProduct: CardProduct) => {
        const updatedGroupProducts = groupedProducts.map((product) => {
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

        setGroupedProducts(updatedGroupProducts);
    }

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

    // add products in bulk
    const addProducts = async () => {
        //setSuccessUpload(false);
        if (productData.length > 0) {
            const response = await fetch('api/product/add_multiple', {
                method: "POST",
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            console.log(result);

            if (result) {
                showNotification({
                    title: 'Successfully submitted!',
                    message: 'The products have been successfully uploaded.'
                  });
                //setSuccessUpload(true);
                setGroupedProducts([]);
            }
        }
    }

    // edit Products
    const updateProducts = async () => {
        //setSuccessUpload(false);
        if (editProductData.length > 0) {
            const response = await fetch('api/product/edit_product', {
                method: "POST",
                body: JSON.stringify(editProductData)
            });

            const result = await response.json();
            console.log(result);

            if (result) {
                showNotification({
                    title: 'Successfully submitted!',
                    message: 'The products have been successfully edited.'
                  });
                //setSuccessUpload(true);
                setGroupedProducts([]);
            }
        }
    }

    // adds single product
    //@ts-expect-error eslint throws an error here
    const addProduct = async (values) => {
        console.log('Submitting form with values:', values);
        const response = await fetch('api/product/add_product', {
            method: "POST",
            body: JSON.stringify(values)
        })

        const result = await response.json()
        console.log(result);
    }

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

    const convertGroupedProducts = () => {
        const products: Product[] = [];
        groupedProducts.forEach((product) => {
            const { model, brand, colorways } = product;

            colorways.forEach((color) => {
                const { colorway, sizes } = color;

                sizes.forEach((shoeSize) => {
                    const { SKU, size, stock, price } = shoeSize;

                    const tempProduct: Product = {
                        SKU: SKU,
                        Model: model,
                        Brand: brand,
                        Stock: stock,
                        Price: price,
                        Size: size,
                        Colorway: colorway
                    };

                    products.push(tempProduct);
                });
            });
        });

        setProductData(products);
    }

    const convertEditProducts = () => {
        const products: Product[] = [];
        editProducts.forEach((product) => {
            const { model, brand, colorways } = product;

            colorways.forEach((color) => {
                const { colorway, sizes } = color;

                sizes.forEach((shoeSize) => {
                    const { SKU, size, stock, price } = shoeSize;

                    const tempProduct: Product = {
                        SKU: SKU,
                        Model: model,
                        Brand: brand,
                        Stock: stock,
                        Price: price,
                        Size: size,
                        Colorway: colorway
                    };

                    products.push(tempProduct);
                });
            });
        });

        setEditProductData(products);
    }


    useEffect(() => {
        convertGroupedProducts();
        //console.log(productData);
    }, [groupedProducts]);

    useEffect(() => {
        convertEditProducts();
        //console.log(productData);
    }, [editProducts]);

    
    useEffect(() => {
        const getProduct = async() => {
            const response = await fetch('api/product/get_product', {
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
    
    

    return (
        <MantineProvider>
            <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <form onSubmit={productForm.onSubmit(addProduct)}>
                    <p>add product</p>

                    <TextInput 
                        label="sku"
                        placeholder="product sku" 
                        {...productForm.getInputProps('SKU')}
                    />

                    <TextInput 
                        label="name"
                        placeholder="product name" 
                        {...productForm.getInputProps('Model')}
                    />

                    <TextInput 
                        label="vendor"
                        placeholder="product vendor" 
                        {...productForm.getInputProps('Brand')}
                    />

                    <NumberInput
                        label="stock"
                        placeholder="product stock"
                        {...productForm.getInputProps('Stock')}
                    />

                    <NumberInput
                        label="price"
                        placeholder="product price"
                        {...productForm.getInputProps('Price')}
                    />

                    <TextInput
                        label="size"
                        placeholder="product size"
                        {...productForm.getInputProps('Size')}
                    />

                    <TextInput
                        label="colorway"
                        placeholder="product colorway"
                        {...productForm.getInputProps('Colorway')}
                    />
                    
                    <Button type="submit" variant="filled">Submit product</Button>
                </form>

                <FileButton accept={acceptableCSVFileTypes} onChange={onFileChangeHandler}>
                    {(props) => <Button {...props}>Upload CSV File</Button>}
                </FileButton>

                <div className='w-full h-auto flex flex-row flex-wrap'>
                    {groupedProducts &&
                        groupedProducts.map((product, productIndex) =>
                        product.colorways.map((colorway, colorwayIndex) => (
                            <CardTest
                                key={`${productIndex}-${colorwayIndex}`} // Unique key using product and colorway index
                                cardProduct={{
                                    modelId: product.id,
                                    model: product.model,
                                    brand: product.brand,
                                    colorId: colorway.id,
                                    colorway: colorway.colorway,
                                    sizes: colorway.sizes,
                                }}
                                onChange={handleChange}
                                editable={false}
                                setHasErrors={setHasErrors}
                            />
                        ))
                    )}
                </div>
                
                {hasErrors ? (
                    <Tooltip label="Fix all errors before submitting.">   
                        <Button variant='filled' onClick={addProducts} disabled={hasErrors}>Submit Products</Button>
                    </Tooltip>
                ) : (
                   <Button variant='filled' onClick={addProducts} disabled={hasErrors}>Submit Products</Button>
                )}
                

                <p>Edit Products</p>
                <div className='w-full h-auto flex flex-row flex-wrap'>
                    {editProducts &&
                        editProducts.map((product, productIndex) =>
                        product.colorways.map((colorway, colorwayIndex) => (
                            <CardTest
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

                {hasErrors ? (
                    <Tooltip label="Fix all errors before submitting.">   
                        <Button variant='filled' onClick={updateProducts} disabled={hasErrorsEdit}>Submit Edited Products</Button>
                    </Tooltip>
                ) : (
                    <Button variant='filled' onClick={updateProducts} disabled={hasErrorsEdit}>Submit Edited Products</Button>
                )}

                
                <Notifications></Notifications>
                
            </div>
        </MantineProvider>
    );
}
