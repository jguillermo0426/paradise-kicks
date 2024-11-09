import { ProductsOrdered } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();

    const { orderProducts }: { orderProducts: ProductsOrdered[] } = await req.json();

    orderProducts.forEach(async order => {
        const historyCount = order.status_history.length;
        const { data: statusData, error: statusError } = await supabase
            .from('order_status')
            .select('id')
            .eq('status', order.status_history[historyCount - 1].order_status.status)
            .single();

        if (statusError) {
            throw new Error(`Error fetching status_id: ${statusError.message}`);
        }

        const statusId = statusData.id;

        if (statusId != order.status_history[historyCount - 1].order_status.id + 1) {
            const { data: updatedStatus, error: insertError } = await supabase
                .from('status_history')
                .insert([
                    {
                        order_id: order.id,
                        status_id: statusId,
                        updated_at: new Date()
                    }
                ]);

            if (insertError) {
                throw new Error(`Error inserting into status_history: ${insertError.message}`);
            } else {
                return Response.json({ updatedStatus });
            }
        }
        return Response.json({ orderProducts });
    });

    return Response.json({ orderProducts });

}


