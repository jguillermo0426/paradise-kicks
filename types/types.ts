import { NumberInputStylesNames } from "@mantine/core";

export type Product = {
    SKU: string;
    Model: string;
    Brand: string;
    Stock: number;
    Price: number;
    Size: string;
    Colorway: string;
    image_link?: string;
    available: boolean;
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

export type GroupedProduct2 = {
    id: number;
    model: string;
    brand: string;
    colorways: Colorway2[];
}

export type Colorway2 = {
    id: number;
    model: string;
    brand: string;
    colorway: string;
    image_link?: string;
    image_file?: File;
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
    cardId: string;
    modelId: number;
    model: string;
    brand: string;
    colorId: number;
    colorway: string;
    sizes: Size[];
    image_file?: File;
    image_link?: string;
}


export type Order = {
    id: string;
    time_ordered: Date;
    status: string;
    total_price: number;
    customer_name: string;
    address: string;
    contact_no: string;
    email: string;
    payment_method: string;
}

export type PaymentTerms = {
    id: number;
    payment_term: string;
    description?: string;
}

export type ProductsOrdered = {
    order: Order;
    payment_terms: PaymentTerms;
    products: Product[];
}

export type OrderHistory = {
    history_id: number;
    order_id: string;
    product_id: string;
    updated_at: string;
    order_status: {
        status: string;
    };
}