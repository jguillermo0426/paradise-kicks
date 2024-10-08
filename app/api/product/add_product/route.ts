import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    const { data } = await supabase
        .from('product')
        .insert([
            { 
                SKU: formData.SKU,
                Model: formData.Model,
                Brand: formData.Brand,
                Stock: formData.Stock,
                Price: formData.Price,
                Size: formData.Size,
                Colorway: formData.Colorway,
                image_link: formData.image_link,
                available: true
            },
        ])
        .select()

    return Response.json({data});
}
