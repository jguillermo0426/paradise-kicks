'use client'
import { MantineProvider, Select, TextInput, Popover, Button, Pagination, Image, LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GroupedProduct2, Product } from '@/types/types';
import { Card, CardBody } from "@nextui-org/react";
import Link from 'next/link';
import React from 'react';
import classes from "./css/tabs.module.css";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useCart } from '@/utils/useCart';


export default function ProductListing({ searchParams }: { searchParams: string }) {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct2[]>([]);
    const brandLogoMap: Map<string, string> = new Map();
    const [totalPages, setTotalPages] = useState<number>(1);
    const [activePage, setPage] = useState(1);
    const [sortFilter, setSortFilter] = useState<string>("Alphabetical");
    const [sortedProducts, setSortedProducts] = useState<GroupedProduct2[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [query] = useDebounce(searchValue, 500);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    brandLogoMap.set("Nike", "/nike.png");
    brandLogoMap.set("Adidas", "/adidas.png");
    brandLogoMap.set("New Balance", "/new balance.png");
    brandLogoMap.set("On", "/on.png");
    brandLogoMap.set("Puma", "/puma.png");

    useEffect(() => {
        if (!query) {
            router.push("/product-listing");
        }
        else {
            router.push(`/product-listing?search=${query}`);
        }
        console.log(searchValue);
    }, [query, router]);


    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            let filterParam = "";

            if (sortFilter === "Alphabetical") {
                filterParam = "alphabetical";
            } else if (sortFilter === "Price: Lowest to Highest") {
                filterParam = "low_to_high";
            } else if (sortFilter === "Price: Highest to Lowest") {
                filterParam = "high_to_low";
            }


            const response = await fetch(`api/product/get_product?page=${activePage}&search=${query}&sort=${filterParam}`, {
                method: "GET"
            });

            const result = await response.json();
            console.log(result.products);
            if (result.products.length !== 0) {
                const sortedProducts = result.products.sort((a: Product, b: Product) => {
                    if (a.Colorway < b.Colorway) return -1;
                    if (a.Colorway > b.Colorway) return 1;
            
                    const brandComparison = a.Brand.localeCompare(b.Brand);
                    if (brandComparison !== 0) {
                        return brandComparison;
                    }
                    const modelComparison = a.Model.localeCompare(b.Model);
                    if (modelComparison !== 0) {
                        return modelComparison;
                    }
                    return a.Price - b.Price;
                });
        
            

                console.log(sortedProducts);
                const products = groupProducts(sortedProducts);

                let sorted2 = products;
                if (filterParam == "alphabetical") {
                    sorted2 = products.sort((a: GroupedProduct2, b: GroupedProduct2) => {
                        const brandComparison = a.brand.localeCompare(b.brand);
                        if (brandComparison !== 0) {
                            return brandComparison;
                        }
                        return a.model.localeCompare(b.model);
                    });
                } else if (filterParam === "low_to_high") {
                    sorted2 = products.sort((a: GroupedProduct2, b: GroupedProduct2) => a.colorways[0].sizes[0].price - b.colorways[0].sizes[0].price); // Ascending Price order
                } else if (filterParam === "high_to_low") {
                    sorted2 = products.sort((a: GroupedProduct2, b: GroupedProduct2) => b.colorways[0].sizes[0].price - a.colorways[0].sizes[0].price); // Descending Price order
                }

                setGroupedProducts(sorted2);

                if (sortFilter) {
                    setSortedProducts(sorted2);
                }

                setTotalPages(Math.ceil(result.totalProducts / 12));
                setLoading(false);
            }

        };
        getProducts();
    }, [activePage, query, sortFilter]);

    useEffect(() => {
        setPage(1);
    }, [query]);

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

    const handleSortChange = (value: string | null) => {
        if (value != null) {
            setSortFilter(value);
        }
        else {
            setSortFilter("Alphabetical");
        }

    }


    const getImageLink = (groupedProduct: GroupedProduct2) => {
        const colorwayWithImage = groupedProduct.colorways.find((colorway) => colorway.image_link && colorway.image_link.trim() !== '');
        console.log(colorwayWithImage);

        return colorwayWithImage ? colorwayWithImage.image_link : "";
    };


    return (
        <MantineProvider>
            <div className="flex flex-col items-center m-3 desktop:mt-20 desktop:m-30 relative z-50 mb-[18rem] bg-white overflow-x-hidden min-h-screen">
                <div className="flex flex-col items-center w-full max-w-[1440px] m-6">
                    <div className="w-full flex flex-col desktop:flex-row items-end justify-between mb-8 px-12">
                        <div className="w-full flex mt-[100px] desktop:mt-0 flex-row items-end justify-start">
                            <p className="text-[64px] mb-[-25px] desktop:text-[100px] desktop:mb-[-36px] text-black " style={{ fontFamily: "EpilogueBold", letterSpacing: "-3px", marginRight: "20px" }}>Catalogue</p>
                            <p className="text-black max-sm:text-[15px] text-[24px]" style={{ fontFamily: "EpilogueBold", marginRight: "auto" }}>All items</p>
                        </div>

                        <div className="w-full relative desktop:flex desktop:flex-row items-end justify-end">
                            <Popover width={200} position="bottom" withArrow shadow="md">
                                <Popover.Target>
                                    <Button
                                        color="black"
                                        className="mt-[20px]"
                                        styles={{
                                            label: {
                                                fontFamily: "EpilogueThin"
                                            },
                                            root: {
                                                width: "150px",
                                                height: "35px",
                                                borderRadius: "6px",
                                                marginRight: "20px"
                                            },
                                        }}
                                    >
                                        <svg
                                            data-slot="icon"
                                            fill="none"
                                            strokeWidth="1.3"
                                            stroke="currentColor"  
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            className="w-5 h-5 mr-3 mb-1 text-white"  
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                            />
                                        </svg>
                                        Filter / Sort
                                        
                                    </Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Select
                                        placeholder="Select filter"
                                        data={['Alphabetical', 'Price: Lowest to Highest', 'Price: Highest to Lowest']}
                                        value={sortFilter}
                                        onChange={handleSortChange}
                                        comboboxProps={{ withinPortal: false }}
                                        styles={{
                                            input: {
                                                fontFamily: "Epilogue"
                                            },
                                            option: {
                                                fontFamily: "Epilogue"
                                            }
                                        }}
                                    />
                                </Popover.Dropdown>
                            </Popover>
                            
                            <TextInput
                                placeholder="Search"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                className="w-full mt-[-200px] desktop:w-[250px]"
                                styles={{
                                    input: {
                                        fontFamily: "Epilogue",
                                        height: "45px"
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="w-[98%] min-[451px]:w-[83%] desktop:w-[90%] desktop:mt-0 mt-[60px] grid grid-cols-1 min-[320px]:grid-cols-2 min-[768px]:grid-cols-3 min-[993px]:grid-cols-4 gap-2 min-[406px]:gap-5 min-[558px]:gap-8 mb-16 justify-start">
                        {sortedProducts &&
                            sortedProducts.map((product, productIndex) =>
                                <Link key={productIndex} href={`/product-details/${product.model}`}>
                                    <Card key={productIndex} className="hover:outline hover:outline-dark-gray hover:outline-2 
                                                                        desktop:w-[300px] desktop:h-[450px] 
                                                                        max-[1201px]:w-[205px]
                                                                        max-[1050px]:w-[190px] max-[1050px]:h-[375px] 
                                                                        max-[993px]:w-[230px]
                                                                        max-[902px]:w-[220px]
                                                                        max-[844px]:w-[210px]
                                                                        max-[803px]:w-[200px]
                                                                        max-[767px]:w-[250px] max-[767px]:h-[405px]  max-[767px]:ml-5
                                                                        max-[650px]:w-[240px] max-[650px]:ml-0
                                                                        max-[616px]:w-[230px] max-[616px]:h-[400px] 
                                                                        max-[583px]:w-[215px] max-[583px]:h-[385px] 
                                                                        max-[557px]:w-[200px]
                                                                        max-[492px]:w-[190px]
                                                                        max-[471px]:w-[180px]
                                                                        max-[450px]:w-[200px] max-[450px]:h-[370px]
                                                                        max-[424px]:w-[190px] max-[450px]:h-[360px]
                                                                        max-[405px]:w-[180px] max-[450px]:h-[350px]
                                                                        max-[393px]:w-[173px] max-[393px]:mb-1
                                                                        max-[389px]:w-[170px] 
                                                                        max-[368px]:w-[160px]
                                                                        max-[355px]:w-[145px]
                                                                        max-[320px]:w-[140px]
                                                                        max-[319px]:w-[230px] max-[319px]:ml-10 max-[319px]:mr-10
                                                                        h-[400px] 
                                                                        flex flex-col items-center border border-dark-gray border-opacity-40 rounded-2xl p-8">
                                        <CardBody className="flex flex-col justify-between h-full">
                                            <div className="w-full h-[200px] border border-dark-gray border-opacity-10 rounded-[10px] flex flex-col items-center justify-center w-[240px] desktop:min-h-[200px] overflow-hidden">
                                            <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
                                                <Image
                                                    alt="Shoe Image"
                                                    className="w-full h-[200px] object-cover"
                                                    //fit="contain"
                                                    src={getImageLink(product) || "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png"}
                                                    //h={200}
                                                    //w={250} 
                                                    />
                                            </div>
                                            <div className="w-full h-full flex flex-col items-start justify-between mt-[5px]">
                                                <div className="flex flex-col items-start">
                                                    <small className="font-semibold mt-4 
                                                                      text-[14px] 
                                                                      text-[#177F7D] tracking-tight" style={{ fontFamily: "Epilogue" }}>{getTotalColors(product)}
                                                        {getTotalColors(product) > 1
                                                            ? " colors"
                                                            : " color"
                                                        }
                                                    </small> 

                                                    <p className="mt-[5px] text-[18px] desktop:text-[20px] leading-tight" style={{ fontFamily: "EpilogueSemiBold", letterSpacing: "-0.5px" }}>{product.brand} {product.model}</p>
                                                    <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>&#8369; {getLowestPrice(product).toFixed(2)}</p>
                                                </div>

                                                <div className="w-full flex flex-row items-end justify-between mt-4">
                                                    <p className="text-success font-semibold text-[12px] desktop:text-[14px]" style={{ fontFamily: "Epilogue" }}>{getTotalStocks(product)} stocks left</p>
                                                    <Image
                                                        className="h-[20px] desktop:h-[28px]"
                                                        src={brandLogoMap.get(product.brand)}
                                                        //height={28}
                                                    />
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            )}
                    </div>
                </div>
                <Pagination
                    value={activePage}
                    total={totalPages}
                    className="mb-12"
                    onChange={(page) => {
                        setPage(page);
                        window.scrollTo(0, 0);
                    }}
                    classNames={{
                        root: classes.pageRoot
                    }}
                />
            </div>
        </MantineProvider>
    );
}
