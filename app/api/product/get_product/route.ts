import { createClient } from "@/utils/supabase/server";
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const supabase = createClient();
    const { data: product, error: productErr } = await supabase.from('product').select()
    console.log(product);
    return Response.json({product});
}
