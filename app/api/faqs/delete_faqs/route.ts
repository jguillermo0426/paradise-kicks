import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const { faqId } = await req.json();


    const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', faqId)

    if (error) {
        console.log("failed to delete: ", faqId, error.message);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500
        });
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200
    });
}
