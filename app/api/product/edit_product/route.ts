import { Product } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    console.log(formData);

    const products: Product[] = [];

    const promises = formData.map(async (product: Product) => {
        const { data } = await supabase
            .from('product')
            .update({
                Model: product.Model,
                Brand: product.Brand,
                Price: product.Price,
                Stock: product.Stock,
                Colorway: product.Colorway,
                Size: product.Size,
                image_link: product.image_link
            })
            .eq('SKU', product.SKU);      
        products.push(data as unknown as Product);  
    });

    await Promise.all(promises);

    return Response.json({products});
}
