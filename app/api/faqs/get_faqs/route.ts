import { createClient } from "@/utils/supabase/server";

export async function GET() {

    const supabase = createClient();

    const { data: faqs} = await supabase
        .from('faqs')
        .select()
        .order('id', { ascending: true })


    // console.log("faqs: ", faqs);
    return Response.json({ faqs });
}
