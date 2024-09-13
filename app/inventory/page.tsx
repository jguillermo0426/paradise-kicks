'use client'
import { Product } from '@/types/types';
import { useForm } from '@mantine/form';
import { MantineProvider, TextInput, Button, NumberInput, NativeSelect } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function Inventory() {
    const [productList, setProductList] = useState([]);

    const productForm = useForm({
        initialValues: {
            sku: "",
            name: "",
            category: "",
            vendor: "",
            stock: 0,
            price: 0.00,
            size: 0.0
        }
    })

    const addProduct = async (values: any) => {
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
    }, [])

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
                    
                    <Button type="submit" variant="filled">Submit product</Button>
                </form>
            </div>
        </MantineProvider>
    );
}
