import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = createClient();
    const { data: product } = await supabase.from('product').select().eq('available', true);  
    console.log(product);
    return Response.json({product});
}
