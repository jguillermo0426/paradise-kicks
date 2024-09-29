'use client'

import { Epilogue } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Button, Combobox, ComboboxStore, InputBase, useCombobox } from '@mantine/core';
import { GroupedProduct, Order, OrderHistory, Product, ProductsOrdered } from '@/types/types';
import CardStatus from './CardStatus';
import moment from 'moment';

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
})

export default function SetStatus() {
    const [orderIds, setOrderIds] = useState<string[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState<JSX.Element[]>();
    const [selectedOrderId, setSelectedOrderId] = useState<string>('');
    const [chosenOrder, setChosenOrder] = useState<ProductsOrdered[]>();
    const [orderProducts, setOrderProducts] = useState<Product[]>();
    const [statusHistory, setStatusHistory] = useState<OrderHistory[]>();
    
    useEffect(() => {
        const getOrder = async() => {
            const response = await fetch('api/orders/get_orders', {
                method: "GET"
            })
    
            const result = await response.json();
            console.log(result.order);
            const orders = Array.from(new Set(result.order));
            setOrderIds(orders as string[]);
        }
        getOrder();
    }, []);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    useEffect(() => {    
        const shouldFilterOptions = orderIds.every((order) => order !== search);
        
        const filteredOptions = shouldFilterOptions
            ? orderIds.filter((order) => order.toLowerCase().includes(search.toLowerCase().trim()))
            : orderIds;
    
        const optionBox = filteredOptions.map((item) => (
            <Combobox.Option value={item} key={item}>
                {item}
            </Combobox.Option>
        ));

        setOptions(optionBox);
    }, [orderIds]);

    useEffect(() => {
        orderIds.map((order) => {
            if (order === value) {
                setSelectedOrderId(order);
            }
        });
    });

    const selectId = async (value: string) => {
        const response = await fetch('api/orders/get_from_id', {
            method: "POST",
            body: JSON.stringify(value)
        })

        const result = await response.json()
        console.log(result.order);
        setChosenOrder(result.order);
    }

    const getStatus = async (value: string) => {
        const response = await fetch('api/orders/get_status_history', {
            method: "POST",
            body: JSON.stringify(value)
        })

        const result = await response.json()
        console.log(result.order);
        setStatusHistory(result.order);
    }
    
    useEffect(() => {
        console.log(chosenOrder);
    }, [chosenOrder]);

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

    useEffect(() => {
        const tempOrders: Product[] = [];
        chosenOrder?.map((order) => {
            tempOrders.push(order.product);
        })

        setOrderProducts(tempOrders);
    }, [chosenOrder]);
    
    return(
        <div className="relative z-50 mb-[18rem] bg-white overflow-hidden flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <p>Orders</p>
            <Combobox
                store={combobox}
                withinPortal={false}
                onOptionSubmit={(val) => {
                    setValue(val);
                    setSearch(val);
                    selectId(val);
                    getStatus(val);
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target>
                    <InputBase
                        rightSection={<Combobox.Chevron />}
                        value={search}
                        onChange={(event) => {
                            combobox.openDropdown();
                            combobox.updateSelectedOptionIndex();
                            setSearch(event.currentTarget.value);
                        }}
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => {
                            combobox.closeDropdown();
                            setSearch(value || '');
                        }}
                        placeholder="Search value"
                        rightSectionPointerEvents="none"
                        />
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>
                        {options && options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
            <p>Selected order: {selectedOrderId || 'No ID selected'}</p>
                    
            { chosenOrder && 
                (
                    <div className='flex flex-col justify-center items-center'>
                        <p>Address: {chosenOrder[0].orders.address}</p>
                        <p>Email Address: {chosenOrder[0].orders.email}</p>
                        <p>Contact no: {chosenOrder[0].orders.contact_no}</p>
                        <p>Total Price: {chosenOrder[0].orders.total_price}</p>
                        <p>Time Ordered: {chosenOrder[0].orders.time_ordered.toString()}</p>
                        <p>Name: {chosenOrder[0].orders.customer_name}</p>
                        <p>Payment method: {chosenOrder[0].orders.payment_method}</p>
                        <p>Proof link: {chosenOrder[0].orders.proof_link || "No submission"}</p>

                        <p>Order summary</p>
                        <div className='flex flex-row flex-wrap'>
                            { orderProducts?.map((product, index) => (
                                <CardStatus product={product} />
                            ))}
                        </div>

                        <Button>Ship Order</Button>

                        <div className='flex flex-col'>
                            { statusHistory?.map((status, index) => (
                                <div className='flex flex-col m-5'>
                                    <p>Date: {new Date(status.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}</p>
                                    <p>Status: {status.order_status.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    );
}