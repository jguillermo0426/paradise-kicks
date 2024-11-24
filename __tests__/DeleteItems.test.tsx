import { POST } from '@/app/api/product/delete_product/route';
// import { POST } from '@/app/api/product/add_product/route';
import { Product } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import {v4 as uuidv4} from 'uuid';


/* DELETE */

jest.mock('@/utils/supabase/server', () => {
    return {
        createClient: jest.fn().mockImplementation(() => {
            return {
                // mock supabase funcs
                from: jest.fn().mockReturnValue({
                    update: jest.fn().mockReturnValue({
                        eq: jest.fn().mockResolvedValue(
                            { data: [{ SKU: uuidv4(), available: false }] }
                        ),
                    }),
                }),
            };
        }),
    };
});
  

global.Response = {
    json: jest.fn((data) => data),
} as any;


describe('Delete Product', () => {
    it('should update the SKU and available field of the product', async () => {
        const client = createClient();

        const testProduct: Product = {
            SKU: 'old-sku',
            Model: 'Test Model',
            Brand: 'Test Brand',
            Stock: 10,
            Price: 100,
            Size: '7.5 M / 9 W',
            Colorway: 'Red',
            available: true,
        };

        const formData = [testProduct];
        
        const response = await POST({ json: () => Promise.resolve(formData) } as any);

        expect(client.from).toHaveBeenCalledWith('product');
        expect(client.from('product').update).toHaveBeenCalledWith({ SKU: uuidv4(), available: false });
        //expect(client.from('product').eq).toHaveBeenCalledWith('SKU', 'old-sku');

        expect(response).toEqual({
            products: [
                { SKU: 'mocked-uuid', available: false },
            ],
        });
    });
});



/* ADD */
/*
jest.mock('@/utils/supabase/server', () => {
    return {
        createClient: jest.fn().mockImplementation(() => {
            // mock supabase functions
            return {
                from: jest.fn().mockReturnValue({
                    insert: jest.fn().mockReturnValue({
                        select: jest.fn().mockResolvedValue(
                            { data: [{ SKU: 'new-sku', available: true }] }
                        ),
                    }),
                }),
                
            };
        }),
    };
});


global.Response = {
    json: jest.fn((data) => data),
} as any;


describe('Add Product', () => {
    it('should insert a new product into the product table', async () => {
        const client = createClient();

        const testProduct = {
            SKU: 'new-sku',
            Model: 'New Model',
            Brand: 'New Brand',
            Stock: 10,
            Price: 100,
            Size: '7.5 M / 9 W',
            Colorway: 'Blue',
            image_link: 'https://example.com/image.jpg',
        };

        const formData = [testProduct];

        const response = await POST({ json: () => Promise.resolve(formData) } as any);

        expect(client.from).toHaveBeenCalledWith('product');
        expect(client.from('product').insert).toHaveBeenCalledWith([
            {
                SKU: 'new-sku', 
                Model: 'New Model',
                Brand: 'New Brand',
                Stock: 10,
                Price: 100,
                Size: '7.5 M / 9 W',
                Colorway: 'Blue',
                image_link: 'https://example.com/image.jpg',
                available: true, 
            },
        ]);
        expect(client.from('product').select).toHaveBeenCalled();
    });
});
*/