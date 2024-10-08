import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit_count = 12;
    const limit_offset = (page - 1) * limit_count;

    const supabase = createClient();
    const { data: product, count } = await supabase
    .from('product')
    .select('*', { count: 'exact' })
    .eq('available', true)
    .range(limit_offset, limit_offset + limit_count - 1);

    console.log(product);
    return Response.json({product, count});
}
