import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    const { data, error } = await supabase
        .from('faqs')
        .insert([
            { 
               question: formData.question,
               answer: formData.answer,
            },
        ])
        .select()

    if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500
        });
    }

    return new Response(JSON.stringify({ success: true, data }), {
        status: 200
    });
}
