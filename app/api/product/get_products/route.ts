import { createClient } from "@/utils/supabase/server";

type ModelColor = {
    product_model: string;
    product_colorway: string;
};

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit_count = 12;
    const limit_offset = (page - 1) * limit_count;

    const supabase = createClient();

    const { data: uniqueCombinations, error: uniqueError } = await supabase
        .rpc('get_unique_products', {
            limit_count,
            limit_offset
        });

    if (uniqueError) {
        console.error('Error fetching unique combinations:', uniqueError);
        return new Response('Error fetching unique combinations', { status: 500 });
    }

    if (!uniqueCombinations || uniqueCombinations.length === 0) {
        console.warn('No unique combinations found. Returning empty product list.');
        return Response.json({ products: [], totalProducts: 0 });
    }

    const modelColorwayConditions = uniqueCombinations.map(({ product_model, product_colorway }: ModelColor) => {
        if (!product_model || !product_colorway) {
            console.warn(`Skipping undefined combination: Model=${product_model}, Colorway=${product_colorway}`);
            return null; 
        }
        return `"Model" ='${product_model}' AND "Colorway" = '${product_colorway}'`;
    }).filter((condition: string | null): condition is string => condition !== null).join(' OR ');
    

    if (!modelColorwayConditions) {
        console.warn('No valid model-colorway conditions constructed. Returning empty product list.');
        return Response.json({ products: [], totalProducts: 0 });
    }

    const query = `SELECT *
            FROM PRODUCT
            WHERE (${modelColorwayConditions}) AND "available" = true;`

    const { data: products, error: productError } = await supabase
        .rpc('execute_sql', {query: query});

    if (productError) {
        console.error('Error fetching products:', productError);
        return new Response('Error fetching products', { status: 500 });
    }

    // Define the count query to get the total unique combinations
    const countQuery = `
        SELECT COUNT(*) AS total_unique_combinations
        FROM (
            SELECT DISTINCT "Model", "Colorway"
            FROM product
        ) AS unique_combinations;
    `;

    // Execute the count query using the new Supabase RPC function for counts
    const { data: countData, error: countError } = await supabase
        .rpc('execute_count_sql', { query: countQuery });

    if (countError) {
        console.error('Error fetching total count:', countError);
    } else {
        const totalProducts = countData?.[0]?.total || 0; // Extract the count
        console.log('Total unique products:', totalProducts);

        return Response.json({ products, totalProducts });
    }

}
