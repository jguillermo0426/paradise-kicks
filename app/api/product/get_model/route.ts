import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const productModel = decodeURIComponent(searchParams.get('model') || '');
    const supabase = createClient();
    const { data: model } = await supabase
        .from('product')
        .select()
        .eq('Model', productModel)

    console.log("productModelll:", productModel);
    console.log(model);
    return Response.json({model});
}
