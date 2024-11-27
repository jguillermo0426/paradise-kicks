import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const id = await req.json();
    
    const { data: order, error } = await supabase
        .from('status_history')
        .select(`
            history_id, order_id, updated_at,
            order_status!status_history_status_id_fkey (status)
        `)
        .eq('order_id', id)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error("Error fetching data: ", error);
    } else {
        console.log("orders: ", order);
        console.log(order);
        return Response.json({order});
    }
}