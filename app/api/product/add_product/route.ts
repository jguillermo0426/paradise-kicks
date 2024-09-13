import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    const { data } = await supabase
        .from('product')
        .insert([
            { 
                sku: formData.sku,
                name: formData.name,
                category: formData.category,
                vendor: formData.vendor,
                stock: formData.stock,
                price: formData.price,
                size: formData.size  
            },
        ])
        .select()

    return Response.json({data});
}
