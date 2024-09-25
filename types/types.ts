export type Product = {
    SKU: string;
    Model: string;
    Brand: string;
    Stock: number;
    Price: number;
    Size: string;
    Colorway: string;
};

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