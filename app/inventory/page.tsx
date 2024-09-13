'use client'
import { useForm } from '@mantine/form';
import { MantineProvider, TextInput, Button, NumberInput } from '@mantine/core';

export default function Inventory() {
    const form = useForm({
        initialValues: {
            size: "",
            price: 0.00,
            stock: 0,
            type: ""
        },

        validate: {
            price: (value) => (isNaN(value) ? "price must be a float" : null),
            stock: (value) => (isNaN(value) ? "stock must be an integer" : null),
        }
    });

    const addVariant = async (values: any) => {
        console.log('Submitting form with values:', values);
        const response = await fetch('api/variant/add_variant', {
            method: "POST",
            body: JSON.stringify(values)
        })

        const result = await response.json()
        console.log(result);
    }

    return (
        <MantineProvider>
            <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <form onSubmit={form.onSubmit(addVariant)}>
                    <p>add variant</p>

                    <TextInput 
                        label="size"
                        placeholder="variant size" 
                        {...form.getInputProps('size')}
                    />

                    <NumberInput 
                        label="price"
                        placeholder="variant price" 
                        {...form.getInputProps('price')}
                    />

                    <NumberInput 
                        label="stock"
                        placeholder="variant stock" 
                        {...form.getInputProps('stock')}
                    />

                    <TextInput 
                        label="type"
                        placeholder="variant type" 
                        {...form.getInputProps('type')}
                    />
                    <Button type="submit" variant="filled">Submit variant</Button>
                </form>
                <p>add product</p>
            </div>
        </MantineProvider>
    );
}
