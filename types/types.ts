export type Product = {
    SKU: string;
    Model: string;
    Brand: string;
    Stock: number;
    Price: number;
    Size: string;
    Colorway: string;
};

export type GroupedProduct = {
    id: number;
    model: string;
    brand: string;
    colorways: Colorway[];
}

export type Colorway = {
    id: number;
    colorway: string;
    sizes: Size[];
}

export type Size = {
    id: number;
    SKU: string;
    size: string;
    stock: number;
    price: number;
}

export type CardProduct = {
    modelId: number;
    model: string;
    brand: string;
    colorId: number;
    colorway: string;
    sizes: Size[];
}


export type Order = {
    id: number;
    time_ordered: Date;
    status: string;
    total_price: number;
    customer_name: string;
}

export type ProductsOrdered = {
    order_id: number;
    product_sku: number;
}