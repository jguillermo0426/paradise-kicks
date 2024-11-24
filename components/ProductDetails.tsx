'use client'
import { MantineProvider, Skeleton, Divider, Button, ActionIcon, Tooltip, Notification } from '@mantine/core';
import '@mantine/carousel/styles.css';
import { Carousel } from '@mantine/carousel';
import { useEffect, useRef, useState } from 'react';
import { GroupedProduct2, Product } from '@/types/types';
import { Image } from "@nextui-org/react";
import classes from './css/actionicon.module.css';
import { EmblaCarouselType } from 'embla-carousel-react';
import '@mantine/notifications/styles.css';
import { notifications, Notifications } from '@mantine/notifications';
import { useCart } from '@/utils/useCart';

type ProductProps = {
    productModel: string;
}

export default function ProductDetails({ productModel }: ProductProps) {
    const [groupedProducts, setGroupedProducts] = useState<GroupedProduct2[]>([]);
    const [price, setPrice] = useState<number>(0);
    const [selectedSKU, setSelectedSKU] = useState<string>('');
    const [stock, setStock] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [selectedColorway, setSelectedColorway] = useState<string>('');
    const [quantity, setQuantity] = useState(0);
    const emblaRef = useRef<EmblaCarouselType>();
    const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
    const [addCartItem, setAddCartItem] = useState<Product>();
    const [addedSKU, setAddedSKU] = useState<string>('');

    const { cart, addToCart, itemExists, removeFromCart, getItemFromCart, updateItemQuantity, clearCart } = useCart();

    const buttonStyles = {
        selected: {
            border: "2px solid black"
        },
        unselected: {
            border: "1px solid gray",
        }
    };

    const addCart = async (sku: string) => {
        let productDetails: Product | null = null;

        try {
            const response = await fetch(`/api/product/get_item?sku=${sku}`);
            const result = await response.json();
            
            if (result.item) {
                productDetails = {
                    SKU: result.item.SKU,
                    Model: result.item.Model,
                    Brand: result.item.Brand,
                    Stock: result.item.Stock,
                    Price: result.item.Price,
                    Size: result.item.Size,
                    Colorway: result.item.Colorway,
                    image_link: result.item.image_link,
                    available: result.item.available,
                };
            }
        } catch (error) {
            console.log("Error fetching product details:", error);
        }

        if (!productDetails) {
            notifications.show({
                message: "The selected item could not be added to the cart.",
                color: "red",
            });
            return;
        }
        
        const newCartItem = {
            sku: selectedSKU,
            product: productDetails,
            quantity: quantity
        };

        const itemInCart = getItemFromCart(sku);

        if (itemInCart && quantity > 0) {
            // if item exists in cart, update quantity if it doesn't exceed stock
            const updatedQuantity = itemInCart.quantity + quantity;
            if (updatedQuantity <= stock) {
                updateItemQuantity(newCartItem.sku, quantity);
                console.log('quantity updated in cart', selectedSKU, updateItemQuantity);
                setQuantity(0);     // reset displayed quantity after adding to cart
                notifications.show({
                    message: "This item has been added to your cart!",
                    color: "green",
                });
            } else {
                notifications.show({
                    message: "You have reached the maximum quantity for this item.",
                    color: "red"
                });
            }
        } 
        else {
            // add new item to the cart if quantity is greater than 0
            if (quantity > 0 && quantity <= stock) {
                addToCart(newCartItem);
                console.log("Added item to cart:", selectedSKU, quantity);
                setQuantity(0);     // reset displayed quantity after adding to cart
                notifications.show({
                    message: "This item has been added to your cart!",
                    color: "green",
                });
            } else if (quantity > stock) {
                notifications.show({
                    message: "You have reached the maximum quantity for this item.",
                    color: "red"
                });
            } else {
                notifications.show({
                    message: "Please select a color, size, and quantity.",
                    color: "red"
                });
            }
        }
    }

    useEffect(() => {
        const item = getItemFromCart(selectedSKU);
        if (item) {
            setQuantity(quantity);
        }
      }, [cart]);

    useEffect(() => {
        const getModel = async () => {
            const response = await fetch(`/api/product/get_model?model=${productModel}`, {
                method: "GET"
            });
    
            const result = await response.json();
            console.log(result.model);
            if (result.model.length !== 0) {
                const product = groupProducts(result.model);
                const sizes = result.sizes.map((item: { size: string }) => item.size);
                setGroupedProducts(product);
                setUniqueSizes(sizes); 
                setLoading(false);
                console.log(product);
            } else {
                console.log(`${productModel} not found`);
            }
        };
        getModel();
    }, [productModel]); 

    // get details of item added to cart
    /*useEffect(() => {
        const getItem = async () => {
            let props: Product = {
                SKU: "",
                Model: "",
                Brand: "",
                Stock: 0,
                Price: 0,
                Size: "",
                Colorway: "",
                image_link: "",
                available: true,
            };

            const response = await fetch(`/api/product/get_item?sku=${addedSKU}`, {
                method: "GET"
            });
            const result = await response.json();

            if (result.item) {
                props = {
                    SKU: result.item.SKU,
                    Model: result.item.Model,
                    Brand: result.item.Brand,
                    Stock: result.item.Stock,
                    Price: result.item.Price,
                    Size: result.item.Size,
                    Colorway: result.item.Colorway,
                    image_link: result.item.image_link,
                    available: result.item.available,
                }
                setAddCartItem(props as Product)
                console.log(result.item);
            } else {
                props = {
                    SKU: "",
                    Model: "",
                    Brand: "",
                    Stock: 0,
                    Price: 0,
                    Size: "",
                    Colorway: "",
                    image_link: "",
                    available: false
                }
                console.log("Item not found");
            }
            setAddCartItem(props);
        };

        getItem();
    }, [addedSKU]);*/
    

    // groups the products based on their model, colorway, and size/stock/price
    const groupProducts = (products: Product[]) => {
        let modelId = 0;
        let colorwayId = 0;
        let sizeId = 0;

        const grouped: { [Model: string]: GroupedProduct2 } = {};
        products.forEach((product) => {
            const { SKU, Model, Brand, Colorway, Size, Stock, Price, image_link } = product;

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

    const getHighestPrice = (groupedProduct: GroupedProduct2) => {
        let highestPrice = groupedProduct.colorways[0].sizes[0].price;
        groupedProduct.colorways.forEach((colorway) => {
            for (let i = 0; i < colorway.sizes.length; i++) {
                if (highestPrice < colorway.sizes[i].price) {
                    highestPrice = colorway.sizes[i].price
                }
            }
        });

        return highestPrice;
    }

    const handleColorwayChange = (product: GroupedProduct2, colorway: string) => {
        let colorStock = 0;

        setSelectedSKU('');
        setSelectedColorway(colorway);
        setQuantity(0);

        let colorwayIndex = -1;

        product.colorways.forEach((colorwayItem, index) => {
            if (colorwayItem.colorway === colorway) {
                colorwayIndex = index
                colorwayItem.sizes.forEach((size) => {
                    colorStock += size.stock;
                });
            }
        });
        setStock(colorStock);
        if (colorwayIndex != -1) {
            if (emblaRef.current) {
                emblaRef.current.scrollTo(colorwayIndex);
            }
        }
    };

    const handleSizeChange = (product: GroupedProduct2, sku: string) => {
        setQuantity(0)
        product.colorways.forEach((colorway) => {
            if (colorway.colorway === selectedColorway) {
                colorway.sizes.forEach((size) => {
                    if (sku === size.SKU) {
                        setPrice(size.price);
                        setSelectedSKU(sku);
                        setStock(size.stock);
                    }
                });
            }
        });
    };

    const startingPriceDisplay = (product: GroupedProduct2) => {
        let lowestPrice = getLowestPrice(product);
        let highestPrice = getHighestPrice(product);

        if (lowestPrice === highestPrice) {
            return `₱${lowestPrice.toString()}`;
        }
        else {
            return `₱${lowestPrice.toString()} - ₱${highestPrice.toString()}`;
        }
    }

    const getColorwayPriceRange = (product: GroupedProduct2) => {
        let highestPrice = 0;
        let lowestPrice = Infinity;
        product.colorways.forEach((colorway) => {
            if (colorway.colorway === selectedColorway) {
                colorway.sizes.forEach((size) => {
                    if (size.price < lowestPrice) {
                        lowestPrice = size.price
                    }
                    if (size.price > highestPrice) {
                        highestPrice = size.price
                    }
                });
            }
        });

        return lowestPrice === highestPrice
            ? `₱${lowestPrice}`
            : `₱${lowestPrice} - ₱${highestPrice}`;
    };

    const increaseQuantity = () => {
        let newQuantity = quantity + 1;
        let itemInCart = cart.find(item => item.sku === selectedSKU);
        let itemQuantity = 0;
        let newItemQuantity = 0;

        if (itemInCart) {
            itemQuantity = itemInCart.quantity;
            newItemQuantity = itemQuantity + newQuantity;

            if (newItemQuantity <= stock) {
                setQuantity(newQuantity); 
            } else {
                notifications.show({
                    message: "You have reached the maximum quantity for this item.",
                    color: "red"
                });
            }
        } else {
            // check if the quantity increase would exceed the stock
            if (newQuantity <= stock) {
                setQuantity(newQuantity); 
            } else {
                notifications.show({
                    message: "You have reached the maximum quantity for this item.",
                    color: "red"
                });
            }  
        }  
    };

    const decreaseQuantity = () => {
        if (quantity > 0) {
            let newQuantity = quantity - 1;
            setQuantity(newQuantity);
        }
    }


    return (
        <MantineProvider>
            <div className='pb-[3rem] flex flex-col items-center 
                            m-0 relative z-50 mb-[18rem] bg-white overflow-hidden min-h-screen'>
                {loading ? (
                    <><div className="ml-[35px] mt-10 desktop:ml-[65px]" style={{ marginRight: "auto" }}>
                        <Button
                            component="a"
                            href="/product-listing"
                            variant="filled"
                            fullWidth
                            color="black"
                            radius="md"
                            styles={{
                                root: {
                                    height: "46px",
                                    width: "150px"
                                },
                                label: {
                                    fontFamily: "Epilogue",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    color: "#EDEDED"
                                }
                            }}
                        >
                            Return
                        </Button>
                    </div><div className="flex flex-row justify-center w-full mx-8 my-4 p-6">
                            <div className="flex flex-col items-center w-[55%] max-w-[724px] mx-8">
                                <Skeleton height={764} radius="xl" />
                            </div>
                            <div className="flex flex-col w-[45%] justify-start ml-6 mx-4">
                                <Skeleton height={20} width={250} radius="md" mb={8} />
                                <Skeleton height={60} width={250} radius="lg" mb={8} />
                                <Skeleton height={20} width={150} radius="md" mb={40} />

                                <Skeleton height={20} width={400} radius="md" mb={8} />
                                <Skeleton height={20} width={400} radius="md" mb={8} />
                                <Skeleton height={20} width={400} radius="md" mb={8} />
                            </div>
                        </div></>
                ) : (
                    groupedProducts &&
                    groupedProducts.map((product, productIndex) =>
                        <>
                            <div className="ml-[35px] mt-10 desktop:ml-[65px]" style={{ marginRight: "auto" }}>
                                <Button
                                    component="a"
                                    href="/product-listing"
                                    variant="filled"
                                    fullWidth
                                    color="black"
                                    radius="md"
                                    className="hover:outline hover:outline-offset-2 hover:outline-dark-gray shadow-lg"
                                    styles={{
                                        root: {
                                            height: "46px",
                                            width: "150px"
                                        },
                                        label: {
                                            fontFamily: "Epilogue",
                                            fontWeight: 700,
                                            fontSize: "16px",
                                            color: "#EDEDED"
                                        }
                                    }}
                                >
                                    Return
                                </Button>
                            </div>
                            <div key={productIndex} className="flex flex-col min-[878px]:flex-row justify-center w-full mx-8 my-2 py-6">
                                {/* PRODUCT PICTURES */}
                                <div className="h-[764px] flex flex-col items-center rounded-xl mx-8 
                                                min-[879px]:w-[55%]
                                                min-[1228px]:max-w-[724px]
                                                max-[1228px]:h-[534px] max-[1228px]:mb-10
                                                max-[456px]:h-[234px] max-[1228px]:mb-3
                                                max-[393px]:mx-0
                                                max-[393px]:max-w-[724px]">
                                    <Carousel
                                        withIndicators
                                        loop
                                        getEmblaApi={(embla) => { emblaRef.current = embla; }}
                                    >
                                        {product.colorways.map((colorway, colorwayIndex) => <Carousel.Slide key={colorwayIndex}>
                                            <Image
                                                alt="Card background"
                                                className="object-cover rounded-xl
                                                           w-[724px] h-[664px] 
                                                           min-[1228px]:w-[724px] 
                                                           min-[1228px]:h-[764px]
                                                           max-[1228px]:h-[534px]
                                                           max-[456px]:h-[234px]
                                                           max-[393px]:max-w-[724px]"
                                                src={colorway.image_link || "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/W+NIKE+DUNK+LOW.png"}
                                                //width={724}
                                                //height={764} 
                                                />
                                        </Carousel.Slide>
                                        )}
                                    </Carousel>
                                </div>

                                {/* PRODUCT DETAILS */}
                                <div className="max-[878px]:w-full 
                                                max-[878px]:px-10
                                                max-[878px]:py-5 
                                                max-[878px]:mx-0
                                                flex flex-col w-[45%] justify-start mx-4">
                                    <p className="font-bold text-success max-[456px]:text-[12px] text-[18px] min-[1228px]:text-[20px] text-[#474747]" style={{ fontFamily: "Epilogue", marginBottom: "8px" }}>
                                        {selectedColorway === ''
                                            ? getTotalStocks(product)
                                            : stock} stocks left
                                    </p>
                                    <p className="max-[456px]:text-[32px] text-[52px] min-[1228px]:text-[72px] tracking-tighter" style={{ fontFamily: "EpilogueBold", lineHeight: "1.00" }}>{product.brand} {product.model}</p>
                                    <p className="text-[20px] min-[1228px]:text-[24px]" style={{ fontFamily: "EpilogueMedium" }}>
                                        {selectedColorway === "" && selectedSKU === ""
                                            ? `${startingPriceDisplay(product)}`
                                            : selectedColorway !== "" && selectedSKU === ""
                                                ? `${getColorwayPriceRange(product)}`
                                                : `₱${price.toString()}`}
                                    </p>

                                    {/* COLORWAYS */}
                                    <Divider my="md" />
                                    <p className="text-[20px]" style={{ fontFamily: "Epilogue", letterSpacing: "-1px" }}>Color</p>
                                    <div className="w-full flex flex-wrap items-center justify-start mb-8 gap-0">
                                        {product.colorways.map((colorway, colorwayIndex) =>
                                            <Button
                                                key={colorwayIndex}
                                                variant="default"
                                                className='h-[58px] my-1 mr-2'
                                                onClick={() => handleColorwayChange(product, colorway.colorway)}
                                                style={colorway.colorway === selectedColorway ? buttonStyles.selected : buttonStyles.unselected}
                                                styles={{
                                                    root: {
                                                        height: "48px",
                                                        width: "fit-content"
                                                    },
                                                    label: {
                                                        fontFamily: "Epilogue",
                                                        fontWeight: 400,
                                                        color: "black"
                                                    }
                                                }}
                                            >
                                                <p className="text-[13px]" style={{ fontFamily: "Epilogue" }}>{colorway.colorway}</p>
                                            </Button>
                                        )}
                                    </div>

                                    {/* SIZES */}
                                    <p className="text-[20px]" style={{ fontFamily: "Epilogue", letterSpacing: "-1px" }}>Size</p>
                                    <div className="w-full flex flex-wrap items-center justify-start mb-8">
                                        {selectedColorway === "" ? (
                                            uniqueSizes.map((size, sizeIndex) => (
                                                <Button
                                                    key={sizeIndex}
                                                    className='h-[58px] w-[150px] text-[13px] mr-2 mb-2'
                                                    style={buttonStyles.unselected}
                                                    styles={{
                                                        root: {
                                                            backgroundColor: "white",
                                                            height: "48px",
                                                            width:"130px"
                                                        },
                                                        label: {
                                                            fontFamily: "Epilogue",
                                                            fontWeight: 400,
                                                            fontSize: "11px",
                                                            color: "black"
                                                        }
                                                    }}
                                                >
                                                    {size}
                                                </Button>
                                            ))
                                        ) : (
                                            product.colorways
                                                .filter(colorway => colorway.colorway === selectedColorway)
                                                .map((colorway) => colorway.sizes.map((size, sizeIndex) => (
                                                    <Button
                                                        key={sizeIndex}
                                                        onClick={() => handleSizeChange(product, size.SKU)}
                                                        className="h-[58px] w-[150px] text-[13px] mr-2 mb-2"
                                                        disabled={size.stock === 0}
                                                        style={{
                                                            ... (size.stock === 0 ? { opacity: 0.5 } : {}),
                                                            ... (size.SKU === selectedSKU ? buttonStyles.selected : buttonStyles.unselected)
                                                        }}
                                                        styles={{
                                                            root: {
                                                                backgroundColor: "white",
                                                                height: "48px",
                                                                width: "130px"
                                                            },
                                                            label: {
                                                                fontFamily: "Epilogue",
                                                                fontWeight: 100,
                                                                fontSize: "11px",
                                                                color: "black"
                                                            }
                                                        }}
                                                    >
                                                        {size.size}
                                                    </Button>

                                                ))
                                                )
                                        )}
                                    </div>

                                    {/*QUANTITY */}
                                    <p className="text-[20px]" style={{ fontFamily: "Epilogue", letterSpacing: "-1px" }}>Quantity</p>
                                    <div className="flex flex-row items-center justify-between w-[131px] h-[43px] bg-[#1C1C1C] rounded-md mb-6">
                                        {selectedSKU === ""
                                            ? (
                                                <>
                                                    <Tooltip label="Please select a colorway and size first." position="bottom">
                                                        <ActionIcon variant="filled" color="#474747" className={classes.button} size={43} aria-label="minus" disabled>
                                                            <svg width="10" height="2" viewBox="0 0 24 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M24 1C24 1.26522 23.8946 1.51957 23.7071 1.70711C23.5196 1.89464 23.2652 2 23 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H23C23.2652 0 23.5196 0.105357 23.7071 0.292893C23.8946 0.48043 24 0.734784 24 1Z" fill="gray" />
                                                            </svg>
                                                        </ActionIcon>
                                                    </Tooltip>

                                                    <p className="text-[24px]" style={{ fontFamily: "Epilogue", fontWeight: 700, color: "#D1D1D1", marginBottom: "-5px" }}>{quantity}</p>

                                                    <Tooltip label="Please select a colorway and size first." position="bottom">
                                                        <ActionIcon variant="filled" color="#474747" className={classes.button} size={43} aria-label="add" disabled>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M24 12C24 12.2652 23.8946 12.5196 23.7071 12.7071C23.5196 12.8946 23.2652 13 23 13H13V23C13 23.2652 12.8946 23.5196 12.7071 23.7071C12.5196 23.8946 12.2652 24 12 24C11.7348 24 11.4804 23.8946 11.2929 23.7071C11.1054 23.5196 11 23.2652 11 23V13H1C0.734784 13 0.48043 12.8946 0.292893 12.7071C0.105357 12.5196 0 12.2652 0 12C0 11.7348 0.105357 11.4804 0.292893 11.2929C0.48043 11.1054 0.734784 11 1 11H11V1C11 0.734784 11.1054 0.48043 11.2929 0.292893C11.4804 0.105357 11.7348 0 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8946 0.48043 13 0.734784 13 1V11H23C23.2652 11 23.5196 11.1054 23.7071 11.2929C23.8946 11.4804 24 11.7348 24 12Z" fill="gray" />
                                                            </svg>
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </>
                                            )
                                            : (
                                                <>
                                                    <ActionIcon onClick={() => decreaseQuantity()} variant="filled" color="#474747" size={43} aria-label="minus">
                                                        <svg width="10" height="2" viewBox="0 0 24 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M24 1C24 1.26522 23.8946 1.51957 23.7071 1.70711C23.5196 1.89464 23.2652 2 23 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H23C23.2652 0 23.5196 0.105357 23.7071 0.292893C23.8946 0.48043 24 0.734784 24 1Z" fill="white" />
                                                        </svg>
                                                    </ActionIcon>

                                                    <p className="text-[24px]" style={{ fontFamily: "Epilogue", fontWeight: 700, color: "#D1D1D1", marginBottom: "-5px" }}>{quantity}</p>

                                                    <ActionIcon onClick={() => increaseQuantity()} variant="filled" color="#474747" size={43} aria-label="add">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M24 12C24 12.2652 23.8946 12.5196 23.7071 12.7071C23.5196 12.8946 23.2652 13 23 13H13V23C13 23.2652 12.8946 23.5196 12.7071 23.7071C12.5196 23.8946 12.2652 24 12 24C11.7348 24 11.4804 23.8946 11.2929 23.7071C11.1054 23.5196 11 23.2652 11 23V13H1C0.734784 13 0.48043 12.8946 0.292893 12.7071C0.105357 12.5196 0 12.2652 0 12C0 11.7348 0.105357 11.4804 0.292893 11.2929C0.48043 11.1054 0.734784 11 1 11H11V1C11 0.734784 11.1054 0.48043 11.2929 0.292893C11.4804 0.105357 11.7348 0 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8946 0.48043 13 0.734784 13 1V11H23C23.2652 11 23.5196 11.1054 23.7071 11.2929C23.8946 11.4804 24 11.7348 24 12Z" fill="white" />
                                                        </svg>
                                                    </ActionIcon>
                                                </>
                                            )}
                                    </div>

                                    {/* ADD TO CART */}
                                    <Notifications />
                                    <Button
                                        onClick={() => addCart(selectedSKU)}
                                        variant="filled"
                                        fullWidth
                                        radius="md"
                                        color="black"
                                        className="hover:outline hover:outline-offset-2 hover:outline-dark-gray shadow-lg"
                                        styles={{
                                            root: {
                                                height: "58px"
                                            },
                                            label: {
                                                fontFamily: "Epilogue",
                                                fontWeight: 700,
                                                fontSize: "18px"
                                            }
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </div></>
                    )
                )
                }
            </div>
        </MantineProvider>
    );
}
