import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {

    const supabase = createClient();

    let { data: brands, error } = await supabase
        .from('brands')
        .select()


    //console.log("brands: ", brands);
    return Response.json({ brands });
}
