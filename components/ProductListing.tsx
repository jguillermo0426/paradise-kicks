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

                setTotalPages(Math.ceil(result.totalProducts / 4));
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
            <div className="flex flex-col items-center m-20 relative z-50 mb-[18rem] bg-white overflow-x-hidden min-h-screen">
                <div className="flex flex-col items-center w-full max-w-[1440px] m-6">
                    <div className="w-full flex flex-row items-end justify-between mb-8 px-12">
                        <div className="w-full flex flex-row items-end justify-start">
                            <p className="text-[100px]" style={{ fontFamily: "EpilogueBold", letterSpacing: "-3px", marginRight: "20px", marginBottom: "-36px" }}>Catalogue</p>
                            <p className="text-[24px]" style={{ fontFamily: "EpilogueBold", marginRight: "auto" }}>All items</p>
                        </div>

                        <div className="w-full flex flex-row items-end justify-end">
                            <Popover width={200} position="bottom" withArrow shadow="md">
                                <Popover.Target>
                                    <Button
                                        color="black"
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
                                        Filter/Sort
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
                                styles={{
                                    input: {
                                        fontFamily: "Epilogue",
                                        height: "45px",
                                        width: "250px",
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16 justify-start">
                        {sortedProducts &&
                            sortedProducts.map((product, productIndex) =>
                                <Link key={productIndex} href={`/product-details/${product.model}`}>
                                    <Card key={productIndex} className="max-w-[300px] h-[450px] flex flex-col items-center border-[1px] border-black rounded-2xl p-8">
                                        <CardBody className="flex flex-col justify-between h-full">
                                            <div className="flex flex-col items-center justify-center w-[250px] min-h-[200px]">
                                            <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
                                                <Image
                                                    alt="Shoe Image"
                                                    className="rounded-xl w-[250px] h-[250px]"
                                                    fit="contain"
                                                    src={getImageLink(product) || "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png"}
                                                    h={200}
                                                    w={250} />
                                            </div>
                                            <div className="w-full h-full flex flex-col items-start justify-between">
                                                <div className="flex flex-col items-start">
                                                    <small className="mt-4 text-[14px] text-[#808080]" style={{ fontFamily: "Epilogue" }}>{getTotalColors(product)}
                                                        {getTotalColors(product) > 1
                                                            ? " colors"
                                                            : " color"
                                                        }
                                                    </small>

                                                    <p className="text-[16px]" style={{ fontFamily: "EpilogueSemiBold", letterSpacing: "-0.5px" }}>{product.brand} {product.model}</p>
                                                    <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>&#8369; {getLowestPrice(product).toFixed(2)}</p>
                                                </div>

                                                <div className="w-full flex flex-row items-end justify-between mt-4">
                                                    <p className="text-[14px]" style={{ fontFamily: "Epilogue", letterSpacing: "-0.5px" }}>{getTotalStocks(product)} stocks left</p>
                                                    <Image
                                                        src={brandLogoMap.get(product.brand)}
                                                        height={28}
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
