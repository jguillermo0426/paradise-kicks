import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {

    const supabase = createClient();

    let { data: faqs, error } = await supabase
        .from('faqs')
        .select()


    console.log("faqs: ", faqs);
    return Response.json({ faqs });
}
