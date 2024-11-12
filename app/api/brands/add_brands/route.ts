import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    const { data } = await supabase
        .from('brands')
        .insert([
            { 
               brand_name: formData.brand_name,
               brand_image: formData.brand_image,
               available: formData.available
            },
        ])
        .select()

    return Response.json({data});
}
