import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderNumber');

    const supabase = createClient();

    const { data: statusHistory, error } = await supabase
        .from('status_history')
        .select(`
            history_id, order_id, updated_at,
            order_status!status_history_status_id_fkey (status)
        `)
        .eq('order_id', orderId)
        .order('history_id', {ascending: true});

    if (error) {
        console.error("Error fetching data: ", error);
    } else {
        console.log("status history: ", statusHistory);
        console.log(statusHistory);
        return Response.json({ statusHistory });
    }
}
