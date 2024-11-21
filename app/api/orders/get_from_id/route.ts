import { OrderHistory } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const ids = await req.json();

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            products_ordered!products_ordered_order_id_fkey (quantity, product_id(*)),
            payment_terms (*),
            status_history(*, order_status!status_history_status_id_fkey(*))
        `)
        .in('id', ids);

    if (error) {
        console.error("Error fetching data: ", error);
        return Response.json({ error: error.message }, { status: 500 });
    }

    if (orders) {
        // Sort the `status_history` within each order by `updated_at`
        const sortedOrders = orders.map(order => ({
            ...order,
            status_history: order.status_history.sort((a: OrderHistory, b: OrderHistory) =>
                new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
            )
        }));

        console.log("Sorted orders: ", sortedOrders);
        return Response.json({ orders: sortedOrders });
    }

    return Response.json({ orders: [] });
}
