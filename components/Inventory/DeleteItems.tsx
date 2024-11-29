'use client'

import { Product } from "@/types/types";
import { Button, Modal, Pagination } from "@mantine/core";
import { useEffect, useState } from "react";
import CardDelete from "./CardDelete";
import { useDisclosure } from "@mantine/hooks";
import { Epilogue } from 'next/font/google';
import classes from '../css/tabs.module.css';

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
})

type deleteItemProps = {
    onSuccess: () => void;
    searchValue: string;
}

export default function DeleteItems({onSuccess, searchValue}: deleteItemProps) {
    const [selectedItems, setSelectedItems] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [activePage, setPage] = useState(1);
    const isChecked = (product: Product) => selectedItems.includes(product);

    useEffect(() => {
        const filterProducts = () => {
            let productsArray: Product[] = [];

            if (searchValue) {
                products.forEach((product) => {
                    if (product.SKU.toLowerCase().includes(searchValue.toLowerCase())) {
                        productsArray.push(product);
                    }
                })
            } 
            else {
                productsArray = products;
            }

            setFilteredProducts(productsArray);
        };  

        filterProducts();
    }, [searchValue, products]);

    const getItems = async() => {
        const response = await fetch(`/api/product/get_single_products?page=${activePage}&search=${searchValue}`, {
            method: "GET"
        });

        const result = await response.json();
        console.log(result);

        if (result.product.length != 0) {
            setProducts(result.product);
            console.log(result.count);
            setTotalPages(Math.ceil(result.count/12));
        }
    }

    useEffect(() => {
        getItems();
    }, [activePage, searchValue]);

    const handleCheckboxChange = (product: Product) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(product)) {
                return prevSelected.filter(selected => selected.SKU !== product.SKU);
            } else {
                return [...prevSelected, product];
            }
        });
    };

    const deleteItems = async() => {
        if (selectedItems.length > 0) {
            const response = await fetch('/api/product/delete_product', {
                method: "POST",
                body: JSON.stringify(selectedItems)
            });

            const result = await response.json();
            console.log(result);

            if (result) {
                onSuccess();
                //setSuccessUpload(true);
                setProducts([]);
                getItems();
            }
        }
    }
    

    return(
        <>  
            <Modal style={epilogue.style} opened={opened} onClose={close} title="Deletion" size="auto">
                <div className="flex flex-col items-center justify-center">
                    <p style={epilogue.style}>Are you sure you want to delete these products?</p>

                    <div className="flex flex-row items-center justify-center">
                        <Button 
                            className='mt-8 mx-10'
                            style={epilogue.style}
                            styles = {{
                                root: {
                                    backgroundColor: "#E53835",
                                    color: "white",
                                    width: '10vw',
                                }
                            }}
                            onClick={close}
                        >
                            Cancel

                        </Button>
                        <Button 
                            className='mt-8 mx-10 hover:outline hover:outline-offset-2 hover:outline-error shadow-lg'
                            style={epilogue.style}
                            styles = {{
                                root: {
                                    backgroundColor: "#38BDBA",
                                    color: "white",
                                    width: '10vw',
                                }
                            }}
                            onClick={deleteItems}
                        >
                            Delete

                        </Button>
                    </div>
                </div>
            </Modal>

            <div className='w-full flex flex-col items-center justify-center'>
                <div className="w-full flex flex-row items-end justify-end">
                    <Button 
                        className='mt-8 hover:outline-offset-2 hover:outline-error shadow-lg'
                        styles = {{
                            root: {
                                backgroundColor: "#E53835",
                                color: "white",
                                width: '12vw',
                            }
                        }}
                        onClick={() => {
                            if (selectedItems.length > 0) {
                                open();
                            }
                        }}
                    >
                        Delete Selected

                    </Button>
                </div>

                <div className="w-full flex flex-col items-start justify-start">
                    {filteredProducts.map((item) => (
                        <CardDelete
                            key={item.SKU} 
                            item={item}
                            isChecked={isChecked(item)}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ))}
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
            </div>
        </>
    );
}