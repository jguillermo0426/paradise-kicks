import { POST } from '@/app/api/product/edit_product/route';
import { createClient } from '@/utils/supabase/server';

/* EDIT */

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('@/utils/supabase/server', () => {
    const fromMock = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
                data: [{
                    SKU: 'old-sku',
                    Model: 'Edited Model',
                    Brand: 'Edited Brand',
                    Stock: 99,
                    Price: 999,
                    Size: '7.5 M / 9 W',
                    Colorway: 'Blue',
                    image_link: 'https://example.com/image.jpg',
                }],
            }),
        }),
    });

    return {
        createClient: jest.fn().mockImplementation(() => ({
            from: fromMock,
        })),
        fromMock,
    };
});


global.Response = {
    json: jest.fn((data) => data),
} as any;


describe('Edit Product', () => {
    it('should update the edited fields of the product', async () => {
        const client = createClient();

        const editedProduct  = {
            SKU: 'old-sku',
            Model: 'Edited Model',
            Brand: 'Edited Brand',
            Stock: 99,
            Price: 999,
            Size: '7.5 M / 9 W',
            Colorway: 'Blue',
            available: true,
            image_link: 'https://example.com/image.jpg',
        };

        const formData = [editedProduct];

        const response = await POST({ json: () => Promise.resolve(formData) } as any);

        expect(client.from).toHaveBeenCalledWith('product');
        expect(client.from('product').update).toHaveBeenCalledWith(
            { 
                Model: 'Edited Model',
                Brand: 'Edited Brand',
                Stock: 99,
                Price: 999,
                Size: '7.5 M / 9 W',
                Colorway: 'Blue',
                image_link: 'https://example.com/image.jpg',
            }
        );
        expect(client.from('product').update({}).eq).toHaveBeenCalledWith('SKU', 'old-sku');

        expect(response).toEqual({
            products: [[
                { 
                    SKU: 'old-sku',
                    Model: 'Edited Model',
                    Brand: 'Edited Brand',
                    Stock: 99,
                    Price: 999,
                    Size: '7.5 M / 9 W',
                    Colorway: 'Blue',
                    image_link: 'https://example.com/image.jpg',
                },
            ]],
            status: 200
        });
    });
});


it('should return an error for invalid data types', async () => {
    const editedProduct  = {
        SKU: 'old-sku',
        Model: 'Edited Model',
        Brand: 'Edited Brand',
        Stock: 'abc',
        Price: 999,
        Size: '7.5 M / 9 W',
        Colorway: 'Blue',
        available: true,
        image_link: 'https://example.com/image.jpg',
    };

    const formData = [editedProduct];

    const response = await POST({ json: () => Promise.resolve(formData) } as any);

    expect(response).toEqual({
        error: 'Invalid data type for Stock in product old-sku',
        status: 400
    });
});

