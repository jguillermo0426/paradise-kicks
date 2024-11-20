import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search_term = url.searchParams.get('search') || '';
    const sort_order = url.searchParams.get('sort') || '';

    console.log("filter: " + sort_order);
    const limit_count = 4;
    const limit_offset = (page - 1) * limit_count;

    const supabase = createClient();
    console.log("search: " + search_term);

    // Fetch unique models from the database
    const { data: uniqueModels, error: uniqueError } = await supabase
        .rpc('get_unique_models', {
            limit_count,
            limit_offset,
            search_term,
            sort_order
        });

    console.log(uniqueModels);

    if (uniqueError) {
        console.error('Error fetching unique models:', uniqueError);
        return new Response('Error fetching unique models', { status: 500 });
    }

    if (!uniqueModels || uniqueModels.length === 0) {
        console.warn('No unique models found. Returning empty product list.');
        return Response.json({ products: [], totalProducts: 0 });
    }

    console.log("Unique Models Count:", uniqueModels.length);

    // Construct a condition for fetching products that match the unique models
    const modelConditions = uniqueModels.map(({ product_model }: { product_model: string }) => {
        if (!product_model) {
            console.warn(`Skipping undefined model: ${product_model}`);
            return null;
        }
        return `"Model" = '${product_model}'`;
    }).filter((condition: string | null): condition is string => condition !== null).join(' OR ');

    if (!modelConditions) {
        console.warn('No valid model conditions constructed. Returning empty product list.');
        return Response.json({ products: [], totalProducts: 0 });
    }

    // Main product query with pagination
    const query = `
        SELECT *
        FROM product
        WHERE (${modelConditions}) AND "available" = true`;

    console.log("query: " + query);


    const { data: products, error: productError } = await supabase
        .rpc('execute_sql', { query: query });

    //console.log(products);

    if (productError) {
        console.error('Error fetching products:', productError);
        return new Response('Error fetching products', { status: 500 });
    }

    const countQuery = `
        SELECT COUNT(*) AS total_unique_models
        FROM (
            SELECT DISTINCT "Model"
            FROM product
            WHERE "available" = true
        ) AS unique_models;
    `;

    const { data: countData, error: countError } = await supabase
        .rpc('execute_count_sql', { query: countQuery });

    if (countError) {
        console.error('Error fetching total count:', countError);
    }

    const totalProducts = countData?.[0]?.total || 0;

    return Response.json({ products, totalProducts });
}
