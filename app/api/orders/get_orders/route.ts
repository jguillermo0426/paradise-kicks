import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const orderId = (url.searchParams.get('order_id') || '');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 12
    const offset = (page - 1) * limit;

    const supabase = createClient();

    // Build the base query to search by order_id if provided
    const { data: order, error } = await supabase
        .from('products_ordered')
        .select('order_id', { count: 'exact' })
        .ilike('order_id', `${orderId}%`)
        .limit(limit)
        .range(offset, offset + limit - 1);
    ;

    if (error) {
        console.error("Error fetching data: ", error);
        return new Response('Error fetching data', { status: 500 });
    } else {
        console.log("orders: ", order);
        const orderIds = order.map(orderItem => String(orderItem.order_id));

        const countQuery = `
        SELECT COUNT(*) AS total_unique_orders
        FROM (
            SELECT DISTINCT "id"
            FROM orders
        ) AS unique_orders;
    `;

        const { data: countData, error: countError } = await supabase
            .rpc('execute_count_sql', { query: countQuery });

        if (countError) {
            console.error('Error fetching total count:', countError);
        }

        const totalOrders = countData?.[0]?.total || 0;

        return Response.json({
            order: orderIds,
            totalOrders: totalOrders
        });
    }
}
