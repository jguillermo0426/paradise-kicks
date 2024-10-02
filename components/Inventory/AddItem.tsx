'use client'
import { Product } from '@/types/types';
import { useRef, useState } from 'react';
import { Epilogue } from 'next/font/google';
import { NumberInput, Button, Image, ActionIcon, NumberInputHandlers, LoadingOverlay, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Papa from 'papaparse';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '@/firebase/firebase';
import InputField from '../InputField';
import styles from "../css/inputfield.module.css";

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

const acceptableCSVFileTypes = ".csv";

type addItemProps = {
    onSuccess: () => void
}

export default function AddItem({ onSuccess }: addItemProps) {
    const [productData, setProductData] = useState<Product[]>([]);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const csvRef = useRef<HTMLInputElement>(null);
    const handlersRef = useRef<NumberInputHandlers>(null);
    const [file, setFile] = useState<File>();
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [visibleSingle, setVisibleSingle] = useState(false);
    const [visibleCsv, setVisibleCsv] = useState(false);

    // initialize the form for single submission
    const productForm = useForm({
        initialValues: {
            SKU: "",
            Model: "",
            Brand: "",
            Stock: 0,
            Price: 0.00,
            Size: "",
            Colorway: "",
            image_link: "",
            available: true
        }
    });


    // adds single product
    const addProduct = async (values: Product) => {
        setVisibleSingle(true);
        console.log('Submitting form with values:', values);
        const response = await fetch('/api/product/add_product', {
            method: "POST",
            body: JSON.stringify(values)
        })

        const result = await response.json()
        console.log(result);

        if (result) {
            onSuccess();
            setVisibleSingle(false);
        }
    }

    // when file is uploaded, parse its data
    const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Reset displayed data when a file is not chosen
        setProductData([]);

        const files = event.target.files; // Get the file(s) from the input
        if (files && files.length > 0) {
            const csvFile = files[0]; // Get the first selected file
            setUploadedFileName(csvFile.name);

            // Parse data from CSV file into object
            Papa.parse<Product>(csvFile, {
                skipEmptyLines: true,
                header: true,
                complete: function (results) {
                    console.log("Finished:", results.data);
                    const products: Product[] = results.data;
                    setProductData(products);
                }
            });
        } else {
            setUploadedFileName(null); // Reset if no file is selected
        }
    };


    // add products in bulk
    const addProducts = async () => {
        setVisibleCsv(true);
        if (productData.length > 0) {
            const response = await fetch('/api/product/add_multiple', {
                method: "POST",
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            console.log(result);

            if (result) {
                onSuccess();
                setVisibleCsv(false);
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setPreviewURL(URL.createObjectURL(e.target.files[0]));
        } else {
            setFile(undefined);
            console.log('no file uploaded');
        }
    };

    const handleSingleUpload = async (values: Product) => {
        if (!file) return;

        const filename = values.SKU;
        const storageRef = ref(storage, `images/${filename}`);
        try {
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);

            values = {
                ...values,
                image_link: downloadURL,
            };

            console.log('File uploaded successfully! URL: ', downloadURL);
            addProduct(values);
        } catch (error) {
            console.error("Error uploading file: ", error);
            alert('File upload failed.');
        }
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input when the label is clicked
        }
    };

    const handleDivClick = () => {
        if (csvRef.current) {
            csvRef.current.click(); // Trigger the file input click
        }
    };

    const removeFile = () => {
        setUploadedFileName(null);
        if (csvRef.current) {
            csvRef.current.value = '';
        }
        setProductData([]);
    };

    return (
        <main className='flex flex-row justify-between items-center w-full my-8'>
            <form onSubmit={productForm.onSubmit((values) => handleSingleUpload(values))}>
                <Box pos='relative' className='flex flex-col w-[52vw] h-[61vh] border-2 border-black border-solid rounded-lg p-10'>

                    <LoadingOverlay visible={visibleSingle} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

                    <div className='flex flex-row w-full h-[38vh] justify-between'>
                        <div className='flex flex-col w-[14vw] h-full justify-between'>
                            <div className='flex flex-row justify-start items-center'>
                                <p style={epilogue.style} className="font-semibold text-[16px] mr-8">SKU</p>
                                <InputField className="font-normal text-[14px]" {...productForm.getInputProps('SKU')} />
                            </div>
                            <div className='w-[14vw] h-[29vh] flex'>
                                <Image
                                    radius="md"
                                    src={previewURL}
                                    h="auto"
                                    w="auto"
                                    fallbackSrc="/placeholder.svg"
                                    fit="cover"
                                />
                            </div>
                        </div>
                        <div className='flex flex-col w-[14vw] h-full justify-between'>
                            <div className='flex flex-col justify-center items-start mt-3'>
                                <p style={epilogue.style} className="font-semibold text-[16px] mr-8">Model</p>
                                <InputField className="font-normal text-[14px]" {...productForm.getInputProps('Model')} />
                            </div>
                            <div className='flex flex-col justify-center items-start'>
                                <p style={epilogue.style} className="font-semibold text-[16px] mr-8">Brand</p>
                                <InputField className="font-normal text-[14px]" {...productForm.getInputProps('Brand')} />
                            </div>
                            <div className='flex flex-col justify-center items-start'>
                                <p style={epilogue.style} className="font-semibold text-[16px] mr-8">Colorway</p>
                                <InputField className="font-normal text-[14px]" {...productForm.getInputProps('Colorway')} />
                            </div>
                        </div>
                        <div className='flex flex-col w-[14vw] h-full justify-between'>
                            <div className='flex flex-row justify-start items-center'>
                                <p style={epilogue.style} className="font-semibold text-[16px] mr-5">Stock</p>
                                <ActionIcon
                                    styles={{
                                        root: {
                                            borderTopRightRadius: "0",
                                            borderBottomRightRadius: "0",
                                            textAlign: "center",
                                            backgroundColor: "#38bdba",
                                            border: "1px solid #38bdba",
                                            color: "white"
                                        }
                                    }}
                                    style={epilogue.style}
                                    size={40}
                                    variant="default"
                                    onClick={() => handlersRef.current?.decrement()}
                                    className="font-bold text-[20px]"
                                >
                                    -
                                </ActionIcon>
                                <NumberInput
                                    classNames={{
                                        wrapper: styles.numberWrapper,
                                        input: styles.numberInput,
                                    }}
                                    hideControls
                                    style={epilogue.style}
                                    className="font-bold text-[20px]"
                                    handlersRef={handlersRef}
                                    step={1}
                                    min={0}
                                    {...productForm.getInputProps('Stock')}
                                />
                                <ActionIcon
                                    styles={{
                                        root: {
                                            borderTopLeftRadius: "0",
                                            borderBottomLeftRadius: "0",
                                            textAlign: "center",
                                            backgroundColor: "#38bdba",
                                            border: "1px solid #38bdba",
                                            color: "white"
                                        }
                                    }}
                                    style={epilogue.style}
                                    size={40}
                                    variant="default"
                                    className="font-bold text-[20px]"
                                    onClick={() => handlersRef.current?.increment()}
                                >
                                    +
                                </ActionIcon>
                            </div>
                            <div className='flex flex-col justify-center items-start mt-3'>
                                <p style={epilogue.style} className="font-semibold text-[16px] mr-8">Price</p>
                                <NumberInput
                                    style={epilogue.style}
                                    classNames={{
                                        wrapper: styles.regularNumberInput
                                    }}
                                    hideControls className="font-normal text-[14px]" {...productForm.getInputProps('Price')} />
                            </div>
                            <div className='flex flex-col justify-center items-start'>
                                <p style={epilogue.style} className="font-semibold text-[16px] mr-8">Size</p>
                                <InputField className="font-normal text-[14px]" {...productForm.getInputProps('Size')} />
                            </div>
                        </div>
                    </div>
                    <div onClick={handleClick} className='hover:cursor-pointer flex flex-row items-start justify-start mt-5'>
                        <PencilSquareIcon className="h-5 w-5 text-[#38bdba] mr-2" />
                        <label
                            className='text-[#38bdba] text-sm cursor-pointer'
                        >
                            Upload Image
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden" // Hide the default file input
                            accept="image/*" // Optional: limit to image files
                        />
                    </div>

                    <div className='w-full flex flex-row justify-center items-center'>
                        <Button
                            variant='outline'
                            styles={{
                                root: {
                                    border: "solid 2px #38bdba",
                                    color: "#38bdba",
                                    width: '10vw',
                                }
                            }}
                            type="submit"
                            className='pt-10'
                        >
                            Submit Item
                        </Button>
                    </div>
                </Box>
            </form>

            <Box pos='relative'className='w-[34vw] h-[61vh] border-2 flex flex-col justify-center items-center border-black border-solid rounded-lg p-10'>
                <LoadingOverlay visible={visibleCsv} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <div
                    className='hover:cursor-pointer bg-[#EDEDED] border-dashed border-black border-2 flex flex-col items-center justify-center w-full h-4/6 rounded-lg'>
                    <div className='h-full w-full flex flex-col items-center justify-center'>
                        <Image
                            src="/upload icon.svg"
                            h={40}
                            w={40}
                            fallbackSrc="/placeholder.svg"
                            fit="contain"
                        />
                        <p style={epilogue.style} className="font-semibold text-[16px]">Choose a file containing products</p>
                        <p style={epilogue.style} className="font-light text-[13px]">Supported files: CSV</p>
                        <Button className='mt-8'
                            onClick={handleDivClick}
                            styles={{
                                root: {
                                    backgroundColor: "#38BDBA",
                                    color: "white",
                                    width: '10vw',
                                }
                            }}
                        >
                            Browse File
                        </Button>
                    </div>
                </div>

                <div className='my-5 w-full flex flex-row justify-between items-center'>
                    <div className='w-[25vw] h-[6vh] bg-[#EDEDED] rounded-lg flex flex-row items-center'>
                        <Image
                            src="/paperclip.svg"
                            h={20}
                            w={20}
                            fallbackSrc="/placeholder.svg"
                            fit="contain"
                            className='mx-5'
                        />
                        <p style={epilogue.style} className="font-light text-[13px]">{uploadedFileName}</p>
                    </div>
                    <Image
                        src="/trashcan.svg"
                        h={35}
                        w={35}
                        fallbackSrc="/placeholder.svg"
                        fit="contain"
                        className='ml-5 hover:cursor-pointer'
                        onClick={removeFile}
                    />
                </div>

                <div className='w-full flex flex-row justify-center items-center mt-10'>
                    <Button
                        variant='outline'
                        styles={{
                            root: {
                                border: "solid 2px #38bdba",
                                color: "#38bdba",
                                width: '10vw',
                            }
                        }}
                        onClick={addProducts}
                    >
                        Submit Items
                    </Button>
                </div>
                <input
                    type="file"
                    accept={acceptableCSVFileTypes}
                    onChange={onFileChangeHandler}
                    ref={csvRef}
                    style={{ display: 'none' }} // Hide the input
                />

            </Box>
        </main>
    );
}