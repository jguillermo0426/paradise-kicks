import { POST } from '@/app/api/product/delete_product/route';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';


/* DELETE */

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('@/utils/supabase/server', () => {
    const fromMock = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
                data: [{ SKU: 'mocked-uuid', available: false }],
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

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid'),
}));


global.Response = {
    json: jest.fn((data) => data),
} as any;


describe('Delete Product', () => {
    it('should update the SKU and available field of the product', async () => {
        const client = createClient();

        const testProduct = {
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
        expect(client.from('product').update).toHaveBeenCalledWith({ SKU: 'mocked-uuid', available: false });

        expect(response).toEqual({
            products: [[
                { SKU: 'mocked-uuid', available: false },
            ]],
        });
    });
});

