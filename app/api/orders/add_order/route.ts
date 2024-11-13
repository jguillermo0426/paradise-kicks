import { createClient } from "@/utils/supabase/server";
import { itemOrder } from "@/types/types";

export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.json();

   
    const cartItems: itemOrder[] = formData.cartItems;

    const { data, error } = await supabase
        .from('orders')
        .insert([
            {
                id: formData.id,
                time_ordered: new Date(),
                firstname: formData.firstname,
                lastname: formData.lastname,
                customer_name: formData.firstname + " " + formData.lastname,
                total_price: formData.total_price,
                address: `${formData.street} ${formData.city}, ${formData.province} ${formData.zipcode}`,
                contact_no: formData.phone,
                email: formData.email,
                payment_method: formData.paymentMethod,
                payment_terms: formData.term,
                courier: formData.courier,
                notes: formData.notes
            },
        ])
        .select()

    if (error) {
        return Response.json(error);
    }

    cartItems.forEach(async item => {
        const { data: product, error: productError } = await supabase
            .from('product')
            .update({ Stock: item.product.Stock - item.quantity })
            .eq('SKU', item.sku)
            .select()

        if (productError) {
            return Response.json(productError);
        }

        console.log(product);


        const { data: orderedProduct, error: orderedError } = await supabase
            .from('products_ordered')
            .insert([
                {
                    order_id: formData.id,
                    product_id: item.sku,
                    quantity: item.quantity
                },
            ])
            .select()

        if (orderedError) {
            return Response.json(orderedError);
        }

        console.log(orderedProduct);

    });


    const { data: status, error: statusError } = await supabase
        .from('status_history')
        .insert([
            {
                order_id: formData.id,
                status_id: 1,
                updated_at: new Date()
            },
        ])
        .select()

    if (statusError) {
        return Response.json(statusError);
    }

    return Response.json({ data });
}
