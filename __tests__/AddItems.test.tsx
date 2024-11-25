import { POST } from '@/app/api/product/add_product/route';
import { createClient } from '@/utils/supabase/server';

/* ADD */

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('@/utils/supabase/server', () => {
    const insertMock = jest.fn().mockResolvedValue({
        data: [{ SKU: 'new-sku', available: true }],
        error: null, 
    });

 
    const fromMock = jest.fn().mockReturnValue({
        insert: insertMock, 
    });

    return {
        createClient: jest.fn().mockImplementation(() => ({
            from: fromMock, 
        })),
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

        const formData = testProduct;

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

        //expect(response).toEqual({ data: [{ SKU: 'new-sku', available: true }] });
    });
});


it('should return an error if required fields are missing', async () => {
    const formData = {
        Price: 100,
        Size: '7.5 M / 9 W',
    };

    const response = await POST({ json: () => Promise.resolve(formData) } as any);

    expect(response).toEqual({
        error: 'Missing required field: SKU',
        status: 400
    });

    expect(response.status).toBe(400);
});


it('should return an error for invalid data types', async () => {
    const formData = {
        SKU: 'new-sku',
        Model: 'New Model',
        Brand: 'New Brand',
        Stock: 'ten',
        Price: 100,
        Size: '7.5 M / 9 W',
        Colorway: 'Blue',
        image_link: 'https://example.com/image.jpg',
    };

    const response = await POST({ json: () => Promise.resolve(formData) } as any);

    expect(response).toEqual({
        error: 'Invalid data type for Stock',
        status: 400
    });
});
