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
    model: string;
    brand: string;
    colorways: Colorway[];
}

export type Colorway = {
    colorway: string;
    sizes: Size[];
}

export type Size = {
    SKU: string;
    size: string;
    stock: number;
    price: number;
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