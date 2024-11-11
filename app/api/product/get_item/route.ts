import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {

    const url = new URL(req.url);
    const skuQuery = url.searchParams.get('sku') || '';

    const supabase = createClient();
    /*const { data: item } = await supabase
        .rpc('get_cart_items', { sku: skuQuery });*/

    const { data: productItem } = await supabase
    .from('product')
    .select('*')
    .eq('SKU', skuQuery)

    const item = productItem?.[0]

    console.log("SKU: ", skuQuery);
    console.log("Item: ", item);
    return Response.json({ item });
}
