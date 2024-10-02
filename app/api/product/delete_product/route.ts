import { Product } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import {v4 as uuidv4} from 'uuid';

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

    console.log(formData);

    const products: Product[] = [];

    const promises = formData.map(async (product: Product) => {
        let myuuid = uuidv4();
        const { data } = await supabase
            .from('product')
            .update({
                SKU: myuuid,
                available: false
            })
            .eq('SKU', product.SKU);      
        products.push(data as unknown as Product);  
    });

    await Promise.all(promises);

    return Response.json({products});
}
