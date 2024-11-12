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

    if (item.image_link === '') {
        const { data: image, error } = await supabase
        .from('product')
        .select('image_link')
        .eq('Colorway', item.Colorway)
        .limit(1);

        if (error) {
            console.error("Error fetching image:", error);
        } else {
            console.log("image fetched!");
            item.image_link = image[0]?.image_link || '';
        }
    }

    console.log("SKU: ", skuQuery);
    console.log("Item: ", item);
    console.log("Image: ", item.image_link);
    return Response.json({ item });
}
