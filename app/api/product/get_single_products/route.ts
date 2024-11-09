import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('search') || ''; // Get the search query
    const limit_count = 12;
    const limit_offset = (page - 1) * limit_count;

    const supabase = createClient();

    // Build the initial query with filters
    let query = supabase
        .from('product')
        .select('*', { count: 'exact' })
        .eq('available', true);

    // Apply the search filter before setting the range
    if (search) {
        query = query.or(
            `SKU.ilike.%${search}%`
        );
    }

    // Apply pagination (limit and offset)
    query = query.range(limit_offset, limit_offset + limit_count - 1);

    const { data: product, count, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return new Response('Error fetching products', { status: 500 });
    }

    return Response.json({ product, count });
}
