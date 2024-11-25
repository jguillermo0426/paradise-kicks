import { POST } from '@/app/api/product/add_product/route';
import { createClient } from '@/utils/supabase/server';

/* ADD */

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('@/utils/supabase/server', () => {
    // Mock insert to accept arguments and return the mock data
    const insertMock = jest.fn().mockResolvedValue({
        data: [{ SKU: 'new-sku', available: true }],
        error: null, // Simulate no error for the insert operation
    });

    // Mock the from method
    const fromMock = jest.fn().mockReturnValue({
        insert: insertMock,  // simulate insert method
    });

    return {
        createClient: jest.fn().mockImplementation(() => ({
            from: fromMock,  // return fromMock when createClient is called
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

        // Pass formData as an object instead of an array
        const formData = testProduct;

        const response = await POST({ json: () => Promise.resolve(formData) } as any);

        // Ensure `client.from` was called with 'product'
        expect(client.from).toHaveBeenCalledWith('product');

        // Ensure `insert` method is called with correct data
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
