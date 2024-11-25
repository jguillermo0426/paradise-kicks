import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    const requiredFields = [
        { field: 'SKU', type: 'string' },
        { field: 'Model', type: 'string' },
        { field: 'Brand', type: 'string' },
        { field: 'Stock', type: 'number' },
        { field: 'Price', type: 'number' },
        { field: 'Size', type: 'string' },
        { field: 'Colorway', type: 'string' },
        { field: 'image_link', type: 'string' },
    ];

    for (const { field, type } of requiredFields) {
        if (!formData[field]) {
            return Response.json({ status: 400, error: `Missing required field: ${field}` })
        }

        if (typeof formData[field] !== type) {
            return Response.json({ status: 400, error: `Invalid data type for ${field}` })
        }
    }

    const { data, error } = await supabase
        .from('product')
        .insert([
            {
                SKU: formData.SKU,
                Model: formData.Model,
                Brand: formData.Brand,
                Stock: formData.Stock,
                Price: formData.Price,
                Size: formData.Size,
                Colorway: formData.Colorway,
                image_link: formData.image_link,
                available: true
            },
        ]);

    if (error) {
        return Response.json({ status: 500, error: error.message });
    }
    else {
        return Response.json({ status: 200, data });
    }
}
