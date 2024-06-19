// pricingService.test.ts
import { calculateDiscountedPrice } from '../services/pricingService';
import { getPricingRules } from '../models/pricingRules';
import { getProducts } from '../models/products';

jest.mock('../models/pricingRules');
jest.mock('../models/products');

describe('pricingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const products = [
    { sku: 'ipd', name: 'Super iPad', price: 549.99 },
    { sku: 'mbp', name: 'MacBook Pro', price: 1399.99 },
    { sku: 'atv', name: 'Apple TV', price: 109.50 },
    { sku: 'vga', name: 'VGA adapter', price: 30.00 },
  ];

  it('should apply the 3 for 2 deal on Apple TVs', async () => {
    const skus = ['atv', 'atv', 'atv'];
    const pricingRules = [
      {
        id: 1,
        sku: 'atv',
        type: 'quantity_discount',
        parameters: { quantity_threshold: 3, discounted_quantity: 2 },
      },
    ];

    (getPricingRules as jest.Mock).mockResolvedValueOnce(pricingRules);
    (getProducts as jest.Mock).mockResolvedValueOnce(products);

    const result = await calculateDiscountedPrice(skus);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getPricingRules).toHaveBeenCalledTimes(1);
    expect(getPricingRules).toHaveBeenCalledWith('atv');
    expect(result).toEqual({
      totalPrice: 328.5,
      discountedPrice: 219,
    });
  });

  it('should apply the bulk discount on Super iPads when buying more than 4', async () => {
    const skus = ['ipd', 'ipd', 'ipd', 'ipd', 'ipd'];
    const pricingRules = [
      {
        id: 2,
        sku: 'ipd',
        type: 'quantity_discount',
        parameters: { quantity_threshold: 4, discounted_price: 499.99 },
      },
    ];

    (getPricingRules as jest.Mock).mockResolvedValueOnce(pricingRules);
    (getProducts as jest.Mock).mockResolvedValueOnce(products);

    const result = await calculateDiscountedPrice(skus);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getPricingRules).toHaveBeenCalledTimes(1);
    expect(getPricingRules).toHaveBeenCalledWith('ipd');
    expect(result).toEqual({
      totalPrice: 2749.95,
      discountedPrice: 2499.95,
    });
  });

  it('should bundle a free VGA adapter with every MacBook Pro sold', async () => {
    const skus = ['mbp', 'vga'];
    const pricingRules = [
      {
        id: 3,
        sku: 'mbp',
        type: 'bundle',
        parameters: { bundle_item_sku: 'vga', bundle_item_quantity: 1 },
      },
    ];

    (getPricingRules as jest.Mock).mockResolvedValueOnce(pricingRules);
    (getProducts as jest.Mock).mockResolvedValueOnce(products);

    const result = await calculateDiscountedPrice(skus);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getPricingRules).toHaveBeenCalledTimes(2);
    expect(getPricingRules).toHaveBeenCalledWith('mbp');
    expect(getPricingRules).toHaveBeenCalledWith('vga');
    expect(result).toEqual({
      totalPrice: 1429.99,
      discountedPrice: 1399.99,
    });
  });


  it('should handle multiple pricing rules and discounts', async () => {
    const skus = ['atv', 'atv', 'atv', 'ipd', 'ipd', 'ipd', 'ipd', 'ipd', 'mbp', 'vga'];
    const pricingRules = [
      {
        id: 1,
        sku: 'atv',
        type: 'quantity_discount',
        parameters: { quantity_threshold: 3, discounted_quantity: 2 },
      },
      {
        id: 2,
        sku: 'ipd',
        type: 'quantity_discount',
        parameters: { quantity_threshold: 4, discounted_price: 499.99 },
      },
      {
        id: 3,
        sku: 'mbp',
        type: 'bundle',
        parameters: { bundle_item_sku: 'vga', bundle_item_quantity: 1 },
      },
    ];

    (getPricingRules as jest.Mock)
      .mockResolvedValueOnce(pricingRules.filter((rule) => rule.sku === 'atv'))
      .mockResolvedValueOnce(pricingRules.filter((rule) => rule.sku === 'ipd'))
      .mockResolvedValueOnce(pricingRules.filter((rule) => rule.sku === 'mbp'))
      .mockResolvedValueOnce(pricingRules.filter((rule) => rule.sku === 'vga'));

    (getProducts as jest.Mock).mockResolvedValueOnce(products);

    const result = await calculateDiscountedPrice(skus);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getPricingRules).toHaveBeenCalledTimes(4);
    expect(getPricingRules).toHaveBeenCalledWith('atv');
    expect(getPricingRules).toHaveBeenCalledWith('ipd');
    expect(getPricingRules).toHaveBeenCalledWith('mbp');
    expect(getPricingRules).toHaveBeenCalledWith('vga');
    expect(result).toEqual({
      totalPrice: 4508.44,
      discountedPrice: 4118.94,
    });
  });


  it('should handle empty skus array', async () => {
    const skus: string[] = [];

    const result = await calculateDiscountedPrice(skus);

    (getProducts as jest.Mock).mockResolvedValueOnce(products);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getPricingRules).not.toHaveBeenCalled();
    expect(result).toEqual({
      totalPrice: 0,
      discountedPrice: 0,
    });
  });

  it('should handle unknown skus', async () => {
    const skus = ['unknown1', 'unknown2'];

    const result = await calculateDiscountedPrice(skus);

    (getProducts as jest.Mock).mockResolvedValueOnce(products);

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getPricingRules).not.toHaveBeenCalled();

    expect(result).toEqual({
      totalPrice: 0,
      discountedPrice: 0,
    });
  });
});