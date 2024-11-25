import { Product } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    const requiredFields = [
        "SKU",
        "Model",
        "Brand",
        "Stock",
        "Price",
        "Size",
        "Colorway",
        "image_link",
    ];

    for (const item of formData) {
        for (const field of requiredFields) {
            if (!item[field]) {
                return Response.json({
                    status: 400,
                    error: `Missing required field: ${field}`,
                });
            }
        }

        if (typeof item.Stock !== "number" || typeof item.Price !== "number") {
            return Response.json({
                status: 400,
                error: `Invalid data type for Stock or Price`,
            });
        }
    }

    const products: Product[] = formData.map((item: Product) => ({
        SKU: item.SKU,
        Model: item.Model,
        Brand: item.Brand,
        Stock: item.Stock,
        Price: item.Price,
        Size: item.Size,
        Colorway: item.Colorway,
        image_link: item.image_link,
        available: true,
    }));

    const { data, error } = await supabase.from("product").insert(products);

    if (error) {
        return Response.json({ status: 500, error: error.message });
    }

    return Response.json({ status: 200, data });
}
