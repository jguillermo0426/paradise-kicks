import { createClient } from "@/utils/supabase/server";
import { FaqsType } from "@/types/types";

export async function POST(req: Request) {

    const supabase = createClient();

    const { updatedFaq }: { updatedFaq: FaqsType } = await req.json();

    const { data, error } = await supabase
        .from('faqs') 
        .update({ 
            question: updatedFaq.question, 
            answer: updatedFaq.answer 
        })
        .eq("id", updatedFaq.id);

    if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500
        });
    }

    return new Response(JSON.stringify({ success: true, data }), {
        status: 200
    });

}