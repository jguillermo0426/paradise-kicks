'use client'
import { useForm } from '@mantine/form';
import { MantineProvider, TextInput, Button, NumberInput, FileButton } from '@mantine/core';
import { useState } from 'react';
import { CardProduct, GroupedProduct, Product } from '@/types/types';
import Papa from 'papaparse';
import CardTest from '@/components/CardTest';

// file input will only accept .csv files
const acceptableCSVFileTypes = ".csv";

export default function Inventory() {

    // setting up product variables
    const [productData, setProductData] = useState<Product[]>([]);
    //const [productList, setProductList] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);

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
            if (product.model === updatedProduct.model) {
                return {
                    ...product,
                    colorways: product.colorways.map((colorway) => {
                        if (colorway.colorway === updatedProduct.colorway) {
                            return {
                                ...colorway,
                                sizes: updatedProduct.sizes
                            };
                        }
                        return colorway;
                    })
                };
            }
            return product;
        });

        setGroupedProducts(updatedGroupProducts);
    }

    // add products in bulk
    const addProducts = async () => {
        if (productData.length > 0) {
            const response = await fetch('api/product/add_multiple', {
                method: "POST",
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            console.log(result);
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
        const grouped: { [Model: string]: GroupedProduct } = {};
        products.forEach((product) => {
            const { SKU, Model, Brand, Colorway, Size, Stock, Price } = product;

            // initialize the model if it doesnt exist
            if (!grouped[Model]) {
                grouped[Model] = {
                    model: Model,
                    brand: Brand,
                    colorways: []
                };   
            };
            
            // find the shoe of the same brand with matching colorway
            let colorwayGroup = grouped[Model].colorways.find(shoe => shoe.colorway === Colorway);

            // if the group of the colorways doesnt exist, create it
            if (!colorwayGroup) {
                colorwayGroup = { colorway: Colorway, sizes: [] };
                grouped[Model].colorways.push(colorwayGroup);
            }

            // assign the individual sku, size, stock, and price for the shoe
            colorwayGroup.sizes.push({
                SKU: SKU,
                size: Size,
                stock: Stock,
                price: Price 
            });
        });      
        return Object.values(grouped);      
    }

    /*
    useEffect(() => {
        const getProduct = async() => {
            const response = await fetch('api/product/get_product', {
                method: "GET"
            })
    
            const result = await response.json();
            setProductList(result);
        }
        getProduct();
        console.log(productList);
    }, []);
    */

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
                                product={product.model} // Pass the model name
                                brand={product.brand} // Pass the brand name
                                colorway={colorway.colorway} // Pass the colorway
                                sizes={colorway.sizes} // Pass the array of sizes for this colorway
                                onChange={handleChange}
                            />
                        ))
                    )}
                </div>

                <Button variant='filled' onClick={addProducts}>Submit Products</Button>
            </div>
        </MantineProvider>
    );
}
