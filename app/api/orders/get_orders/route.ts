import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = createClient();
    
    const { data: order, error } = await supabase
        .from('products_ordered')
        .select('order_id')

    if (error) {
        console.error("Error fetching data: ", error);
    } else {
        console.log("orders: ", order);
        const orderIds = order.map(orderItem => String(orderItem.order_id));

        console.log(order);
        return Response.json({order: orderIds});
    }
}
