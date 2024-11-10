import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search_term = url.searchParams.get('search') || '';
    const limit_count = 4;
    const limit_offset = (page - 1) * limit_count;
    let from = (page - 1) * limit_count; //1->0, 2->4
    let to = from + limit_count - 1;//3, 7
    
    const supabase = createClient();
    let query = supabase
    .from('product')
    .select()
    .eq('available', true)
    //.range(from, to)

    if (search_term) {
        query = query.textSearch('Model', `${search_term}`,{
            type: 'websearch'
        });
    }

    const { data: product, error } = await query;

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    if (product.length === 0) {
        return Response.json({ message: "No results found" });
    }
    
    console.log(product);
    console.log("Total products: ", product?.length);
    return Response.json({product});
}
