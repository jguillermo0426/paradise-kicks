'use client'
import { useForm } from '@mantine/form';
import { MantineProvider, TextInput, Button, NumberInput, FileButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Product } from '@/types/types';
import Papa from 'papaparse';
import CardTest from '@/components/CardTest';

const acceptableCSVFileTypes = ".csv";

export default function Inventory() {
    const [productData, setProductData] = useState<Product[]>([]);
    const [productList, setProductList] = useState([]);
    const [addedCsv, setAddedCsv] = useState(false);

    const productForm = useForm({
        initialValues: {
            sku: "",
            name: "",
            category: "",
            vendor: "",
            stock: 0,
            price: 0.00,
            size: "",
            colorway: ""
        }
    });

    const onFileChangeHandler = (event: any) => {
        setAddedCsv(false);
        if (event) {
            const csvFile = event;

            Papa.parse<Product>(csvFile, {
                skipEmptyLines: true,
                header: true,
                complete: function(results) {
                    console.log("Finished:", results.data);
                    setAddedCsv(true);
                    setProductData(results.data as Product[]); 
                }
            });
        }
    }

    /*
    useEffect(() => {
        if (productData.length > 0) {
            productData.map((item) => {
                addProduct(item)
            });
        }
    }, [productData])
    */

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

    return (
        <MantineProvider>
            <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <form onSubmit={productForm.onSubmit(addProduct)}>
                    <p>add product</p>

                    <TextInput 
                        label="sku"
                        placeholder="product sku" 
                        {...productForm.getInputProps('sku')}
                    />

                    <TextInput 
                        label="name"
                        placeholder="product name" 
                        {...productForm.getInputProps('name')}
                    />

                    <TextInput 
                        label="category"
                        placeholder="product category" 
                        {...productForm.getInputProps('category')}
                    />

                    <TextInput 
                        label="vendor"
                        placeholder="product vendor" 
                        {...productForm.getInputProps('vendor')}
                    />

                    <NumberInput
                        label="stock"
                        placeholder="product stock"
                        {...productForm.getInputProps('stock')}
                    />

                    <NumberInput
                        label="price"
                        placeholder="product price"
                        {...productForm.getInputProps('price')}
                    />

                    <TextInput
                        label="size"
                        placeholder="product size"
                        {...productForm.getInputProps('size')}
                    />

                    <TextInput
                        label="colorway"
                        placeholder="product colorway"
                        {...productForm.getInputProps('colorway')}
                    />
                    
                    <Button type="submit" variant="filled">Submit product</Button>
                </form>

                <FileButton accept={acceptableCSVFileTypes} onChange={onFileChangeHandler}>
                    {(props) => <Button {...props}>Upload CSV File</Button>}
                </FileButton>

                <div className='w-full h-auto flex flex-row flex-wrap'>
                    {productData && productData.map((item, key) => (
                        <CardTest item={item} key={key}/>
                    ))}
                </div>
            </div>
        </MantineProvider>
    );
}
