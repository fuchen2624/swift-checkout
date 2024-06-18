// pricingService.test.ts
import { calculateDiscountedPrice } from '../services/pricingService';
import { getPricingRules } from '../models/pricingRules';
import { products } from '../models/products';

jest.mock('../models/pricingRules');

describe('pricingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate the total price and discounted price correctly', async () => {
    const skus = ['atv', 'atv', 'atv', 'vga'];
    const pricingRules = [
      {
        id: 1,
        sku: 'atv',
        type: 'quantity_discount',
        parameters: { quantity_threshold: 3, discount_percentage: 33.33 },
      },
      {
        id: 3,
        sku: 'mbp',
        type: 'bundle',
        parameters: { bundle_item_sku: 'vga', bundle_item_quantity: 1 },
      },
    ];

    (getPricingRules as jest.Mock).mockResolvedValueOnce(pricingRules);

    const result = await calculateDiscountedPrice(skus);

    expect(getPricingRules).toHaveBeenCalledTimes(2);
    expect(getPricingRules).toHaveBeenCalledWith('atv');
    expect(getPricingRules).toHaveBeenCalledWith('vga');
    expect(result).toEqual({
      totalPrice: 249.97,
      discountedPrice: 166.64,
    });
  });

  it('should handle empty skus array', async () => {
    const skus: string[] = [];

    const result = await calculateDiscountedPrice(skus);

    expect(getPricingRules).not.toHaveBeenCalled();
    expect(result).toEqual({
      totalPrice: 0,
      discountedPrice: 0,
    });
  });

  it('should handle unknown skus', async () => {
    const skus = ['unknown1', 'unknown2'];

    const result = await calculateDiscountedPrice(skus);

    expect(getPricingRules).toHaveBeenCalledTimes(2);
    expect(getPricingRules).toHaveBeenCalledWith('unknown1');
    expect(getPricingRules).toHaveBeenCalledWith('unknown2');
    expect(result).toEqual({
      totalPrice: 0,
      discountedPrice: 0,
    });
  });
});