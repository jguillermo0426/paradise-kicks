import { POST } from '@/app/api/product/add_multiple/route';
import { createClient } from '@/utils/supabase/server';
import { Product } from '@/types/types';

/* ADD MULTIPLE */

afterEach(() => {
    jest.clearAllMocks();
});

jest.mock('@/utils/supabase/server', () => {
    const insertMock = jest.fn().mockResolvedValue({
        data: [
            { SKU: "sku1", available: true },
            { SKU: "sku2", available: true }
        ],
        error: null
    });

    const fromMock = jest.fn().mockReturnValue({
        insert: insertMock
    });

    return {
        createClient: jest.fn().mockImplementation(() => ({
            from: fromMock
        }))
    };
});

global.Response = {
    json: jest.fn((data) => data),
} as any;


describe('Add Product', () => {

    it("should be able to add multiple product at the same time", async () => {
        const client = createClient();
        const products: Product[] = [
            {
                SKU: "sku1",
                Model: "Model 1",
                Brand: "Brand A",
                Stock: 10,
                Price: 100,
                Size: "7.5 M / 9 W",
                Colorway: "Blue",
                image_link: "https://example.com/image1.jpg",
                available: true,
            },
            {
                SKU: "sku2",
                Model: "Model 2",
                Brand: "Brand B",
                Stock: 20,
                Price: 200,
                Size: "8 M / 10 W",
                Colorway: "Red",
                image_link: "https://example.com/image2.jpg",
                available: true,
            }
        ];

        const response = await POST({
            json: () => Promise.resolve(products)
        } as any);

        expect(client.from).toHaveBeenCalledWith("product");

        expect(client.from("product").insert).toHaveBeenCalledWith(
            products.map(product => ({
                ...product,
                available: true
            }))
        );

        expect(response).toEqual({
            data: [
                { SKU: "sku1", available: true },
                { SKU: "sku2", available: true }
            ],
            status: 200,
        });

    });

    it("should show error message with missing values", async () => {
        const products: any[] = [
            {
                Model: "Model 1",
                Brand: "Brand A",
                Stock: 10,
                Price: 100,
                Size: "7.5 M / 9 W",
                Colorway: "Blue",
                image_link: "https://example.com/image1.jpg"
            }
        ];

        const response = await POST({
            json: () => Promise.resolve(products)
        } as any);       
        
        expect(response).toEqual({
            error: "Missing required field: SKU",
            status: 400,
        });
    });
});