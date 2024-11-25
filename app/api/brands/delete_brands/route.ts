import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const brandName = await req.json();


    const { error } = await supabase
        .from('brands')
        .delete()
        .eq('brand_name', brandName)

    if (error) {
        return Response.json(error);
    }
    
    return Response.json({status: 200});
}
