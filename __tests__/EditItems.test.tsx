import { POST } from '@/app/api/product/edit_product/route';

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('@/utils/supabase/server', () => {
    const updateMock = jest.fn();
    const eqMock = jest.fn();
    const singleMock = jest.fn();
    const selectMock = jest.fn(() => ({
        eq: eqMock.mockReturnValue({
            single: singleMock.mockResolvedValue({
                data: { image_link: 'https://example.com/old-image.jpg' },
                error: null,
            }),
        }),
    }));
    const fromMock = jest.fn(() => ({
        select: selectMock,
        update: updateMock.mockReturnValue({
            eq: eqMock.mockResolvedValue({
                data: [
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
                ],
                error: null,
            }),
        }),
    }));

    return {
        createClient: jest.fn().mockReturnValue({
            from: fromMock,
        }),
        fromMock,
        selectMock,
        eqMock,
        singleMock,
        updateMock,
    };
});

global.Response = {
    json: jest.fn((data) => data),
} as any;

describe('Edit Product API Route', () => {
    it('should update the edited fields of the product', async () => {
        const { createClient, selectMock, eqMock, updateMock } = jest.requireMock(
            '@/utils/supabase/server'
        );
        const client = createClient();

        const editedProduct = {
            SKU: 'old-sku',
            Model: 'Edited Model',
            Brand: 'Edited Brand',
            Stock: 99,
            Price: 999,
            Size: '7.5 M / 9 W',
            Colorway: 'Blue',
            image_link: 'https://example.com/image.jpg',
        };

        const formData = [editedProduct];

        const response = await POST({ json: () => Promise.resolve(formData) } as any);

        expect(client.from).toHaveBeenCalledWith('product');
        expect(selectMock).toHaveBeenCalledWith('image_link');
        expect(eqMock).toHaveBeenCalledWith('SKU', 'old-sku');
        expect(updateMock).toHaveBeenCalledWith({
            Model: 'Edited Model',
            Brand: 'Edited Brand',
            Stock: 99,
            Price: 999,
            Size: '7.5 M / 9 W',
            Colorway: 'Blue',
            image_link: 'https://example.com/image.jpg',
        });

        expect(response).toEqual({
            status: 200,
            products: [
                {
                    Model: 'Edited Model',
                    Brand: 'Edited Brand',
                    Stock: 99,
                    Price: 999,
                    Size: '7.5 M / 9 W',
                    Colorway: 'Blue',
                    image_link: 'https://example.com/image.jpg',
                },
            ],
        });
    });

    it('should return an error for invalid data types', async () => {
        const invalidProduct = {
            SKU: 'old-sku',
            Model: 'Edited Model',
            Brand: 'Edited Brand',
            Stock: 'abc', // Invalid data type
            Price: 999,
            Size: '7.5 M / 9 W',
            Colorway: 'Blue',
            image_link: 'https://example.com/image.jpg',
        };

        const formData = [invalidProduct];

        const response = await POST({ json: () => Promise.resolve(formData) } as any);

        expect(response).toEqual({
            status: 400,
            error: 'Invalid data type for Stock in product old-sku',
        });
    });

    it('should return an error for missing required fields', async () => {
        const incompleteProduct = {
            Model: 'Edited Model',
            Stock: 99,
            Price: 999,
            Size: '7.5 M / 9 W',
            Colorway: 'Blue',
            image_link: 'https://example.com/image.jpg',
        };

        const formData = [incompleteProduct];

        const response = await POST({ json: () => Promise.resolve(formData) } as any);

        expect(response).toEqual({
            status: 400,
            error: 'Invalid data type for Brand in product undefined',
        });
    });
});
