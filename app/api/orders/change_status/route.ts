import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const { id, status } = await req.json();

    // Step 1: Get the status_id for the given status name
    const { data: statusData, error: statusError } = await supabase
        .from('order_status')
        .select('id')
        .eq('status', status)
        .single(); // Fetch one row, assuming status is unique
    
    if (statusError) {
        throw new Error(`Error fetching status_id: ${statusError.message}`);
    }

    const statusId = statusData.id;

    // Step 2: Insert the order_id, status_id, and current timestamp into the status_history table
    const { data: updatedStatus, error: insertError } = await supabase
        .from('status_history')
        .insert([
            {
                order_id: id,
                status_id: statusId,
                updated_at: new Date() // Set to current timestamp
            }
        ]);

    if (insertError) {
        throw new Error(`Error inserting into status_history: ${insertError.message}`);
    } else {
        return Response.json({updatedStatus});
    }
}


