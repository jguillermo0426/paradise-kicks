import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const id = await req.json();
    
    const { data: order, error } = await supabase
        .from('products_ordered')
        .select(`
            orders!products_ordered_order_id_fkey (*),
            product (*)
        `)
        .eq('order_id', id);

    if (error) {
        console.error("Error fetching data: ", error);
    } else {
        console.log("orders: ", order);
        console.log(order);
        return Response.json({order});
    }
}
