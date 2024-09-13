import { createClient } from "@/utils/supabase/server";
import { type NextRequest } from 'next/server'

export async function GET() {
    const supabase = createClient();
    const { data: product } = await supabase.from('product').select()
    console.log(product);
    return Response.json({product});
}
