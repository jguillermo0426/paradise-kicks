export type Product = {
    id: number;
    sku: string;
    name: string;
    category: string;
    vendor: string;
    stock: number;
    price: number;
    size: string;
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
    product_id: number;
}