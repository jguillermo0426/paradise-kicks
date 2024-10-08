import { Product } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    console.log(formData);
    const products: Product[] = [];

    formData.forEach((item: Product) => {
        products.push({
            SKU: item.SKU,
            Model: item.Model,
            Brand: item.Brand,
            Stock: item.Stock,
            Price: item.Price,
            Size: item.Size,
            Colorway: item.Colorway,
            image_link: item.image_link,
            available: true
        })
    })
    const { data } = await supabase
        .from('product')
        .insert(products)
        .select()

    return Response.json({data});
}
