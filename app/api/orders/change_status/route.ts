import { ProductsOrdered } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const { orderProducts }: { orderProducts: ProductsOrdered[] } = await req.json();

    const updatePromises = orderProducts.map(async (order) => {
        const historyCount = order.status_history.length;

        if (historyCount === 0) {
            console.error(`No status history for order ${order.id}`);
            return null;
        }

        // Fetch the latest status from the database for this order
        const { data: latestStatusHistory, error: latestStatusError } = await supabase
            .from('status_history')
            .select('status_id')
            .eq('order_id', order.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (latestStatusError) {
            console.error(`Error fetching latest status for order ${order.id}:`, latestStatusError.message);
            return null;
        }

        const latestStatusId = latestStatusHistory?.status_id;
        const lastStatus = order.status_history[historyCount - 1].order_status.status;

        console.log(latestStatusHistory);
        // Fetch the status_id for the last status in the local history
        const { data: statusData, error: statusError } = await supabase
            .from('order_status')
            .select('id')
            .eq('status', lastStatus)
            .single();

        if (statusError) {
            console.error(`Error fetching status_id for order ${order.id}:`, statusError.message);
            return null;
        }

        const newStatusId = statusData?.id;

        console.log(`Order: ${order.id}`);
        console.log(`Database latest status_id: ${latestStatusId}`);
        console.log(`Fetched status_id: ${newStatusId} for status: ${lastStatus}`);

        console.log(`status id: ${newStatusId}, latest id: ${latestStatusId}`);
        // Check if the latest status in the DB matches the last status in the local history
        if (newStatusId !== latestStatusId) {
            const { data: updatedStatus, error: insertError } = await supabase
                .from('status_history')
                .insert([
                    {
                        order_id: order.id,
                        status_id: newStatusId,
                        updated_at: new Date(),
                    }
                ]);

            if (insertError) {
                console.error(`Error inserting into status_history for order ${order.id}:`, insertError.message);
                return null;
            }

            console.log(`Successfully inserted status history for order ${order.id}`, updatedStatus);
            return updatedStatus;
        }

        console.log(`No update needed for order ${order.id}, status is already correct.`);
        return null;
    });

    // Wait for all updates to finish
    const results = await Promise.all(updatePromises);

    // Filter out null results where no update was needed
    const successfulUpdates = results.filter(result => result !== null);

    // Return the response
    return Response.json({ results: successfulUpdates, orderProducts });
}
