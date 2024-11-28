import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const productModel = decodeURIComponent(searchParams.get('model') || '');
    const supabase = createClient();
    const { data: model } = await supabase
        .from('product')
        .select()
        .eq('Model', productModel);
    
    // const query = `
    //     SELECT DISTINCT "Size"
    //     FROM product
    //     WHERE "Model" = '${productModel}';
    // `
    const { data: sizes } = await supabase
        .rpc('get_unique_sizes', { model: productModel});

    console.log("Model: ", productModel);
    //console.log("Sizes: ", sizes);
    return Response.json({ model, sizes });
}
