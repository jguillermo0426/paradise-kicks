import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const ids = await req.json();
    
    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            products_ordered!products_ordered_order_id_fkey (*),
            payment_terms (*)
        `)
        .in('id', ids);

    if (error) {
        console.error("Error fetching data: ", error);
    } else {
        console.log("orders: ", orders);
        console.log(orders);
        return Response.json({orders});
    }
}
