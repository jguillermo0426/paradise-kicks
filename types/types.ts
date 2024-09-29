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
    id: string;
    time_ordered: Date;
    status: string;
    total_price: number;
    customer_name: string;
    address: string;
    contact_no: string;
    email: string;
    payment_method: string;
    proof_link?: string;
}

export type ProductsOrdered = {
    orders: Order;
    product: Product;
}

export type OrderHistory = {
    history_id: number;
    order_id: string;
    updated_at: string;
    order_status: {
        status: string;
    };
}