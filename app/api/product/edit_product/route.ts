import { Product } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    console.log(formData);

    const products: Product[] = [];
    const errors: string[] = [];

    const editableFields = [
        { field: 'Model', type: 'string' },
        { field: 'Brand', type: 'string' },
        { field: 'Stock', type: 'number' },
        { field: 'Price', type: 'number' },
        { field: 'Size', type: 'string' },
        { field: 'Colorway', type: 'string' },
        { field: 'image_link', type: 'string' },
    ];

    for (const product of formData) {
        for (const { field, type } of editableFields) {
            if (typeof product[field] !== type) {
                console.log(`Invalid data type for ${field} in product ${product.SKU}`);
                return Response.json({
                    status: 400,
                    error: `Invalid data type for ${field} in product ${product.SKU}`
                });
            }

            if (field !== "image_link" && (product[field] === null || product[field] === undefined || product[field] === "")) {
                return Response.json({
                    status: 400,
                    error: `Missing required field: ${field} in product ${product.SKU}`,
                });
            }
        }
    }

    const promises = formData.map(async (product: Product) => {
        const { data: existingData, error: fetchError } = await supabase
            .from('product')
            .select('image_link')
            .eq('SKU', product.SKU)
            .single();

        if (fetchError) {
            errors.push(`Error fetching existing data for ${product.SKU}: ${fetchError.message}`);
            return;
        }

        const updatedProduct = {
            Model: product.Model,
            Brand: product.Brand,
            Price: product.Price,
            Stock: product.Stock,
            Colorway: product.Colorway,
            Size: product.Size,
            image_link: product.image_link || existingData?.image_link,
        };

        const { error: updateError } = await supabase
            .from('product')
            .update(updatedProduct)
            .eq('SKU', product.SKU);

        if (updateError) {
            errors.push(`Error updating product ${product.SKU}: ${updateError.message}`);
        } else {
            products.push(updatedProduct as Product);
        }
    });

    await Promise.all(promises);

    //return Response.json({products});

    if (errors.length > 0) {
        console.log(errors.join("; "));
        return Response.json({ status: 500, error: errors.join("; ") });
    }
    else {
        return Response.json({ status: 200, products });
    }
}
