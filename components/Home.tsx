'use client'
import { MantineProvider, UnstyledButton, Image, Divider, Accordion, Button, Affix, Popover, Skeleton } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import '@mantine/carousel/styles.css';
import { BrandsType, GroupedProduct2, Product, FaqsType } from '@/types/types'
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import Link from 'next/link';


export default function Home() {
    const [brands, setBrands] = useState<BrandsType[]>();
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct2[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [faqs, setFaqs] = useState<FaqsType[]>();


    const exploreIcon = (<svg className="max-[477px]:w-[11px] max-[477px]:stroke-1 max-[769px]:w-[13px] stroke-2" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5625 13.4375L13.4375 1.5625M13.4375 1.5625H4.53125M13.4375 1.5625V10.4688" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>)

    const quickHelpArrow = (<svg width="20" height="20" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 28.9618L19.1652 14.4362L1 1.00002" strokeWidth="2" stroke="#1C1C1C"/>
    </svg>)

    
    useEffect(() => {
        const getBrands = async () => {
            setLoadingBrands(true);
    
            let fetchedBrandsArray: BrandsType[] = [];
            let fetchedBrand: BrandsType;
            
            const response = await fetch(`/api/brands/get_brands`, {
                method: "GET"
            });
        
            const result = await response.json();
            if (result.brands.length !== 0) {
                result.brands.forEach((brand: any) => {
                    fetchedBrand = {
                        id: brand.id,
                        brand_name: brand.brand_name,
                        brand_image: brand.brand_image
                    }
                    fetchedBrandsArray.push(fetchedBrand);
                });
        
                console.log(fetchedBrandsArray);
                setBrands(fetchedBrandsArray);
                setLoadingBrands(false);
            } else {
                console.log("brands not found");
            }
        };
        getBrands();
    }, []);

    useEffect(() => {
        const getHomeProducts = async () => {
            setLoadingProducts(true);

            const response = await fetch('api/product/get_home_products', {
                method: "GET"
            });

            const result = await response.json();
            console.log(result.products);
            
            if(result.products.length != 0) {
                const fetchedProducts = groupProducts(result.products);
                setGroupedProducts(fetchedProducts);
                setLoadingProducts(false);
            }
        }
        getHomeProducts();
    }, []);


    const groupProducts = (products: Product[]) => {
        let modelId = 0;
        let colorwayId = 0;
        let sizeId = 0;

        const grouped: { [Model: string]: GroupedProduct2 } = {};
        products.forEach((product) => {
            const { SKU, Model, Brand, Colorway, Size, Stock, Price, image_link } = product;

            if (product.available) {
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
            }

        });
        return Object.values(grouped);
    }

    useEffect(() => {
        const getFaqs = async () => {
            let fetchedFaqsArray: FaqsType[] = [];
            let fetchedFaq: FaqsType;
            
            const response = await fetch(`/api/faqs/get_faqs`, {
                method: "GET"
            });
        
            const result = await response.json();
            if (result.faqs.length !== 0) {
                result.faqs.forEach((faq: any) => {
                    fetchedFaq = {
                        id: faq.id,
                        question: faq.question,
                        answer: faq.answer
                    }
                    fetchedFaqsArray.push(fetchedFaq);
                });
        
                console.log(fetchedFaqsArray);
                setFaqs(fetchedFaqsArray);
            } else {
                console.log("faqs not found");
            }
        };
        getFaqs();
    }, []);
    

    const getTotalStocks = (groupedProduct: GroupedProduct2) => {
        let totalStocks = 0;
        groupedProduct.colorways.forEach((colorway) => {
            colorway.sizes.forEach((size) => {
                totalStocks += size.stock;
            });
        });

        return totalStocks;
    }

    const getTotalColors = (groupedProduct: GroupedProduct2) => {
        let totalColors = 0;
        groupedProduct.colorways.forEach((colorway) => {
            totalColors += 1;
        });

        return totalColors;
    }

    const getLowestPrice = (groupedProduct: GroupedProduct2) => {
        let lowestPrice = groupedProduct.colorways[0].sizes[0].price;
        groupedProduct.colorways.forEach((colorway) => {
            for (let i = 0; i < colorway.sizes.length; i++) {
                if (lowestPrice > colorway.sizes[i].price) {
                    lowestPrice = colorway.sizes[i].price
                }
            }
        });

        return lowestPrice;
    }

    const getImageLink = (groupedProduct: GroupedProduct2) => {
        const colorwayWithImage = groupedProduct.colorways.find((colorway) => colorway.image_link && colorway.image_link.trim() !== '');
        console.log(colorwayWithImage);

        return colorwayWithImage ? colorwayWithImage.image_link : "";
    };

    const getBrandLogo = (brandName: string) => {
        let brandImageLink = (brands?.find(brand => brand.brand_name === brandName))?.brand_image;
        return brandImageLink;
    }

    const scrolltoFAQs = (element_id: string) => {
        const element = document.getElementById(element_id)
        element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }

    const autoplay = useRef(Autoplay({ delay: 750, stopOnInteraction: false }));

    return (
        <MantineProvider>
            <div className="flex flex-col items-center z-0 relative bg-white h-full">
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="w-full h-full flex flex-col relative z-0">
                        <Image
                            className="w-screen shadow-lg"
                            src="/homeimage.png"
                        />
                        <div className="max-[320px]:w-[80%] max-[477px]:w-[70%] max-[769px]:w-[65%] max-[769px]:-mt-10 max-[1200px]:w-[50%] absolute inset-0 z-10 w-[40%] h-full mr-auto shadow-2xl" style={{ backgroundColor: 'rgba(28, 28, 28, 0.23)' }}>
                            <div className="flex flex-col w-full h-full items-start justify-between px-16 py-[25%] max-[769px]:px-10 max-[477px]:px-5">
                                <p className="ml-10 text-[4vw] tracking-tighter" style={{ fontFamily: "EpilogueBold", color: "white", lineHeight: 1.1 }}>
                                    <span className="text-[5vw] mr-[1.5px]" style={{ fontStyle: "italic" }}>B</span>ringing<br/>
                                    today's most<br/>
                                    in-demand<br/>

                                    <div className="max-[769px]:mb-1" style={{ display: "inline-block", transform: "rotate(-4deg)"}}>
                                        <span className="max-[769px]:rounded-[5px] max-[769px]:p-1 max-[769px]:px-2shadow-2xl text-[#1A5756] bg-[#EDEDED] p-2 pb-1 px-4 rounded-[10px]">sneakers</span><br/>
                                    </div><br/>
                                    
                                    within your<br/>
                                    reach.
                                </p>
                                <div className="max-[477px]:mt-5 max-[1200px]:mt-10 ml-10 flex flex-col justify-center">
                                    <UnstyledButton component="a" href="/product-listing">
                                        <div className="max-[477px]:h-[25px] max-[477px]:w-[165px] max-[477px]:outline-2 max-[477px]:outline-offset-2 max-[477px]:rounded-sm
                                                        max-[769px]:h-[32px] max-[769px]:w-[190px] max-[769px]:outline-2 max-[769px]:outline-offset-3
                                                        flex flex-row items-center justify-between h-[40px] w-[250px] px-4 py-2
                                                        hover:ease-in hover:duration-200 hover:outline hover:outline-offset-4 hover:outline-[#177F7D] hover:bg-[#177F7D]
                                                        outline outline-offset-4 outline-[#22A7A4] bg-[#22A7A4] shadow-xl rounded-lg">
                                            <p className="max-[477px]:pl-0
                                                          max-[477px]:text-[11px] max-[769px]:text-[13px] pl-1 pt-1 text-[16px] font-semibold" style={{ fontFamily: "Epilogue", color: "white" }}>
                                                Explore Catalogue
                                            </p> 
                                            {exploreIcon}
                                        </div>
                                    </UnstyledButton>

                                </div>                           
                            </div>            
                        </div>
                    </div>   
                </div>

                <div className="mt-5 w-full flex flex-col items-center justify-center max-[420px]:px-5 max-[768px]:py-6 max-[768px]:px-12 px-16 py-10">
                    {/* FEATURED BRANDS */}
                    <div className="w-full flex flex-col items-center justify-center mb-6 p-1">
                        <p className="text-[4vw] md:text-[40px] max-[768px]:text-[22px] max-[768px]:-mb-5" style={{ fontFamily: "EpilogueBold", color: "#1C1C1C", letterSpacing: -1 }}> 
                            Our Featured Brands
                        </p>
                    </div>
                    <div className="flex flex-row items-center w-[95%] justify-center mb-10">
                        {loadingBrands ? (
                            <div className="flex flex-row w-full justify-start gap-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Skeleton key={index} height={68} width="20%" radius="md" />
                                ))}
                            </div>
                        ) : (
                            <Carousel
                                withControls={false}
                                className="w-full"
                                height={68}
                                loop
                                slideSize="calc((100% - 4 * 16px) / 5)" // exact calculation for 5 slides with gaps
                                slideGap="16px"
                                slidesToScroll={1}
                                controlsOffset="xs"
                                align="center"
                                plugins={[autoplay.current]}
                                onMouseEnter={autoplay.current.stop}
                                onMouseLeave={autoplay.current.reset}
                            >
                                {brands ? (
                                    brands.map((brand, brandIndex) => (
                                        <Carousel.Slide key={brandIndex}>
                                            <div className="max-[768px]:mt-3 max-[768px]:h-[80%] align-items-center flex items-center justify-center w-full h-full px-2 rounded-lg
                                                            border border-black border-2">
                                                <Image
                                                    className="max-[768px]:h-[25px] h-[35px]"
                                                    fit="contain"
                                                    src={brand.brand_image}
                                                    alt={`Brand ${brandIndex}`}
                                                />
                                            </div>
                                        </Carousel.Slide>
                                    ))
                                ) : (
                                    <Skeleton height={68} width="100%" radius="md" />
                                )}
                            </Carousel>
                        )}
                    </div>
                    {/* CATALOGUE */}
                    <div className="flex flex-col items-center w-full max-w-[1440px] m-6">
                        {loadingProducts ? (
                            <div className="flex flex-row items-center justify-center">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton key={index} className="mr-8" width={300} height={470} radius="xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16 justify-start">
                                {groupedProducts &&
                                    groupedProducts.map((product, productIndex) =>
                                        <Link key={productIndex} href={`/product-details/${product.model}`}>
                                            <Card key={productIndex} className="max-w-[300px] h-[470px] flex flex-col items-center border border-black rounded-2xl p-8
                                                                                hover:outline hover:outline-dark-gray hover:outline-2">
                                                <CardBody className="flex flex-col justify-between h-full">
                                                    <div className="rounded-[10px] -mt-8 flex flex-col items-center justify-center w-full w-[250px] min-h-[250px]">
                                                        <Image
                                                            radius="md"
                                                            alt="Shoe Image"
                                                            fit="cover"
                                                            src={getImageLink(product) || "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png"}
                                                            h={250}
                                                            w={250} />
                                                    </div>
                                                    <div className="w-full h-full flex flex-col items-start justify-between">
                                                        <div className="flex flex-col items-start">
                                                            <small className="font-semibold mt-4 text-[14px] text-[#177F7D]" style={{ fontFamily: "Epilogue" }}>{getTotalColors(product)}
                                                                {getTotalColors(product) > 1
                                                                    ? " colors"
                                                                    : " color"
                                                                }
                                                            </small>

                                                            <p className="text-[16px]" style={{ fontFamily: "EpilogueSemiBold", letterSpacing: "-0.5px" }}>{product.brand} {product.model}</p>
                                                            <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>&#8369; {getLowestPrice(product).toFixed(2)}</p>
                                                        </div>

                                                        <div className="w-full flex flex-row items-end justify-between mt-4">
                                                            <p className="font-semibold text-[#2E7D31] text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>{getTotalStocks(product)} stocks left</p>
                                                            <Image
                                                                src={getBrandLogo(product.brand)}
                                                                className="h-[28px]"
                                                            />
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Link>
                                    )}
                            </div>

                        )}
                        
                    </div>
                    {/* SHOW ALL */}
                    <UnstyledButton component="a" href="/product-listing">
                        <div className="flex flex-col items-center justify-center w-[164px] h-[40px] pt-1 mb-10
                                        hover:ease-in hover:duration-200 hover:outline hover:outline-offset-4 hover:outline-[#177F7D] hover:bg-[#177F7D]
                                        outline outline-offset-4 outline-[#22A7A4] bg-[#22A7A4] shadow-xl rounded-lg">
                            <p className="text-[16px] text-[#FFFFFF]" style={{ fontFamily: "Epilogue", fontWeight: 600, letterSpacing: -1 }}>
                                Show All
                            </p>
                        </div>
                    </UnstyledButton>
                    <div className="w-full my-8">
                        <Divider my="md" size="sm" />
                    </div>

                    {/* FAQS */}
                    <div id="faq-section" className="p-0 mb-10 flex flex-col items-center justify-center w-[90%]">
                        <p className="text-[4vw] md:text-[40px] max-[768px]:text-[22px] mb-8 mr-auto" style={{ fontFamily: "EpilogueBold", color: "black", letterSpacing: -1 }}> 
                            Frequently Asked Questions (FAQs)
                        </p>
                        <Accordion 
                        className="w-full"
                        variant="separated"
                        radius="md"
                        styles={{
                            label: {
                                fontFamily: "Epilogue",
                                fontSize: "16px",
                                fontWeight: 600,
                                paddingInline: "10px"
                            },
                            item: {
                                border: "1px solid #1C1C1C",
                                backgroundColor: "white"
                            },
                            content: {
                                fontFamily: "Epilogue",
                                fontSize: "16px",
                                paddingInline: "30px"
                            }
                        }}>
                            {faqs && 
                                faqs.map((faq, faqIndex) => (
                                    <Accordion.Item 
                                    className="mb-6 border" 
                                    key={faqIndex} 
                                    value={faq.question}
                                    >
                                        <Accordion.Control>{faq.question}</Accordion.Control>
                                        <Accordion.Panel>{faq.answer}</Accordion.Panel>
                                    </Accordion.Item>
                                ))
                            }  
                        </Accordion>
                    </div>

                    {/* QUICK HELP */}
                    <Affix position={{ bottom: 20, right: 20 }}>
                        <Popover width={439} trapFocus position="top" withArrow shadow="md" radius="md">
                            <Popover.Target>
                                <Button w={150} h={47} variant="filled" color="#1C1C1C" radius="md">
                                    <p className="text-[15px]">Quick Help</p>
                                </Button> 
                            </Popover.Target>
                            <Popover.Dropdown>
                                <div className="p-8">
                                    <p className="text-[28px] mb-4" style={{ fontFamily: "EpilogueBold" }}>
                                        Quick Help
                                    </p>
                                    <UnstyledButton component="a">
                                        <div className="flex flex-row items-center justify-between px-6 py-2 mb-3 border border-black rounded-lg">
                                            <p className="text-[18px]" style={{ fontFamily: "Epilogue"}}>
                                                Track Order
                                            </p>
                                            {quickHelpArrow}
                                        </div>
                                    </UnstyledButton>

                                    <UnstyledButton onClick={() => scrolltoFAQs('faq-section')} style={{ display: 'block', width: "100%" }}>
                                        <div className="flex flex-row items-center justify-between px-6 py-2 border border-black rounded-lg">
                                            <p className="text-[18px]" style={{ fontFamily: "Epilogue"}}>
                                                FAQs
                                            </p>
                                            {quickHelpArrow}
                                        </div>
                                    </UnstyledButton>
                                </div>        
                            </Popover.Dropdown>
                        </Popover>
                    </Affix>

                </div>
            </div>
        </MantineProvider>
    );
}
