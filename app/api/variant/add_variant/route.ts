import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    const { data, error } = await supabase
        .from('variant')
        .insert([
            { 
                size: formData.size,
                price: formData.price,
                stock: formData.stock,
                type: formData.type    
            },
        ])
        .select()

    return Response.json({data});
}
