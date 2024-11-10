import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search_term = url.searchParams.get('search') || '';
    const limit_count = 12;
    const limit_offset = (page - 1) * limit_count;

    const supabase = createClient();
    console.log("search: " + search_term);

    // Fetch unique models from the database
    const { data: uniqueModels, error: uniqueError } = await supabase
        .rpc('get_unique_models', {
            limit_count,
            limit_offset,
            search_term
        });

    if (uniqueError) {
        console.error('Error fetching unique models:', uniqueError);
        return new Response('Error fetching unique models', { status: 500 });
    }

    if (!uniqueModels || uniqueModels.length === 0) {
        console.warn('No unique models found. Returning empty product list.');
        return Response.json({ products: [], totalProducts: 0 });
    }

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

    // Query for products that match the unique models
    const query = `SELECT *
        FROM PRODUCT
        WHERE (${modelConditions}) AND "available" = true;`;

    const { data: products, error: productError } = await supabase
        .rpc('execute_sql', { query: query });

    if (productError) {
        console.error('Error fetching products:', productError);
        return new Response('Error fetching products', { status: 500 });
    }

    // Define the count query to get the total number of unique models
    const countQuery = `
        SELECT COUNT(*) AS total_unique_models
        FROM (
            SELECT DISTINCT "Model"
            FROM product
        ) AS unique_models;
    `;

    // Execute the count query for the total number of unique models
    const { data: countData, error: countError } = await supabase
        .rpc('execute_count_sql', { query: countQuery });

    if (countError) {
        console.error('Error fetching total count:', countError);
    }

    // Extract total products count or default to 0
    const totalProducts = countData?.[0]?.total || 0; 

    console.log(products);
    console.log('Total unique products:', totalProducts);

    return Response.json({ products, totalProducts });
}
