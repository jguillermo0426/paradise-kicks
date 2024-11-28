'use client'
import { BrandsType, Product } from '@/types/types';
import { SimpleGrid, Image, Button, Box, LoadingOverlay, TextInput } from '@mantine/core';
import { Notifications, showNotification } from '@mantine/notifications';
import { Epilogue } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import styles from "../css/inputfield.module.css"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase/firebase';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'swap',
})

export default function Brands() {
    const [brands, setBrands] = useState<BrandsType[]>();
    const imgRef = useRef<HTMLInputElement>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>();

    const brandForm = useForm({
        initialValues: {
            id: 0,
            brand_name: "",
            brand_image: "",
            available: true
        }
    });


    const handleDivClick = () => {
        if (imgRef.current) {
            imgRef.current.click(); // Trigger the file input click
        }
    };

    const removeFile = () => {
        setUploadedFileName(null);
        setFile(null);
        if (imgRef.current) {
            imgRef.current.value = '';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setUploadedFileName(e.target.files[0].name);
        } else {
            setFile(undefined);
            console.log('no file uploaded');
        }
    };

    const handleSingleUpload = async (values: BrandsType) => {
        if (!file) return;

        const filename = values.brand_name;
        const storageRef = ref(storage, `images/${filename}`);
        try {
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);

            values = {
                ...values,
                brand_image: downloadURL,
            };

            console.log('File uploaded successfully! URL: ', downloadURL);

            if (downloadURL != "" && values.brand_name != "") {
                addBrand(values);
            }
            else {
                alert("One or more empty fields");
            }
        } catch (error) {
            console.error("Error uploading file: ", error);
            alert('File upload failed.');
        }
    };

    const handleNotification = (text: string) => {
        showNotification({
            message: text,
        });
    };

    const getBrands = async () => {
        const response = await fetch(`/api/brands/get_brands`, {
            method: "GET"
        });

        const result = await response.json();
        if (result.brands.length != 0) {
            console.log(result.brands);
            setBrands(result.brands);
        }
        else {
            console.log("brands not found");
        }
    }


    useEffect(() => {
        getBrands();
    }, []);

    const addBrand = async (values: BrandsType) => {
        const response = await fetch('/api/brands/add_brands', {
            method: "POST",
            body: JSON.stringify(values)
        })

        const result = await response.json()
        console.log(result);

        if (result) {
            handleNotification("Brands have been successfully submitted.");
            getBrands();
        } else {
            handleNotification("Brands were not submitted.");
        }
    }

    const deleteBrand = async (brandName: string) => {
        const response = await fetch('/api/brands/delete_brands', {
            method: "POST",
            body: JSON.stringify(brandName)
        })

        const result = await response.json()
        console.log(result);

        if (result.status == 200) {
            handleNotification("Successfully deleted brand");
            getBrands();
        } else {
            handleNotification("Error in deleting brand");
        }
    }

    return (
        <div className="relative z-50 mb-[18rem] bg-white overflow-hidden flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
            <div className='flex flex-row items-center justify-between w-full'>
                <div className='flex flex-col items-start justify-start'>
                    <p style={epilogue.style} className="text-[72px] font-bold">Brands</p>
                </div>
            </div>

            <div className='flex flex-row items-start justify-between w-full'>
                <div className='w-[60%] h-auto border-black border-2 rounded-2xl mt-12 py-[3.239vh] px-[3.542vw]'>
                    <SimpleGrid cols={3} spacing="xl">
                        {brands?.map((brand, index) => (
                            <div key={index} className='flex flex-col items-center justify-center w-full'>
                                <div className='w-[10.729vw] h-[6.296vh] border-black border-2 rounded-lg flex items-center justify-center'>
                                    <Image
                                        src={brand.brand_image}
                                        h={30}
                                        w="auto"
                                        fit="contain"
                                        fallbackSrc="/placeholder.svg"
                                    />
                                </div>

                                <Image
                                    src="/trashcan.svg"
                                    h="auto"
                                    w={40}
                                    fallbackSrc="/placeholder.svg"
                                    fit="contain"
                                    className='mt-3 hover:cursor-pointer'
                                    onClick={(e) => deleteBrand(brand.brand_name)}
                                />
                            </div>
                        ))}
                    </SimpleGrid>
                </div>
                <form onSubmit={brandForm.onSubmit((values) => handleSingleUpload(values))}>
                    <Box pos='relative' className='w-[34vw] h-auto mt-12 border-2 flex flex-col justify-center items-center border-black border-solid rounded-lg p-10'>
                        {/* <LoadingOverlay visible={visibleCsv} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} /> */}
                        <div
                            className='hover:cursor-pointer bg-[#EDEDED] border-dashed border-black border-2 flex flex-col items-center justify-center w-full h-auto py-10 rounded-lg'>
                            <div className='h-full w-full flex flex-col items-center justify-center'>
                                <Image
                                    src="/upload icon.svg"
                                    h={40}
                                    w={40}
                                    fallbackSrc="/placeholder.svg"
                                    fit="contain"
                                />
                                <p style={epilogue.style} className="font-semibold text-[16px]">Choose a file containing the brand image</p>
                                <p style={epilogue.style} className="font-light text-[13px]">Supported files: PNG, JPEG</p>
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
                        <div className='flex flex-col justify-center items-start mt-3 w-full'>
                            <p style={epilogue.style} className="font-semibold text-[16px] mr-8">Brand Name</p>
                            <TextInput
                                className="font-normal text-[14px] w-full"
                                classNames={{
                                    wrapper: styles.inputWrapper,
                                    input: styles.input,
                                }}
                                {...brandForm.getInputProps('brand_name')}
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
                                type="submit"
                            // onClick={addProducts}
                            >
                                Submit Brand
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={imgRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </Box>
                </form>
            </div>
            <Notifications />
        </div>
    );
}