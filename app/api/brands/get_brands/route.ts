import { createClient } from "@/utils/supabase/server";

export async function GET() {

    const supabase = createClient();

    const { data: brands} = await supabase
        .from('brands')
        .select()


    console.log("brands: ", brands);
    return Response.json({ brands });
}
