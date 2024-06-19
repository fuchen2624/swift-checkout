import { getPricingRules, PricingRule } from '../models/pricingRules';
import { getProducts, Product } from '../models/products';

export async function calculateDiscountedPrice(skus: string[]): Promise<{ totalPrice: number; discountedPrice: number }> {
  let total = 0;
  let discounts = 0;

  const uniqueSkus = Array.from(new Set(skus));
  const products = await getProducts();

  for (const sku of uniqueSkus) {
    const quantity = skus.filter((s) => s === sku).length;
    const product = products.find((p) => p.sku === sku);

    if (product) {
      const price = product.price;
      const pricingRules = await getPricingRules(sku);
      total += price * quantity;
      discounts += calculateDiscounts(quantity, price, pricingRules, products, skus);
    }
  }
  return {
    totalPrice: total,
    discountedPrice: total - discounts
  };
}

function calculateDiscounts(quantity: number, price: number, pricingRules: PricingRule[], products: Product[], skus: String[]): number {
  let discount = 0;

  if (pricingRules) {
    pricingRules.forEach((rule) => {
      switch (rule.type) {
        case 'quantity_discount':
          const { quantity_threshold, discounted_quantity, discounted_price } = rule.parameters;
          const discountTimes = Math.floor(quantity / quantity_threshold);

          if (discountTimes > 0) {
            if (discounted_quantity) {
              discount = Math.max(discount, discountTimes * (quantity_threshold - discounted_quantity) * price);
            } else if (discounted_price) {
              discount = Math.max(discount, discountTimes * quantity * (price - discounted_price));
            }
          }
          break;
        case 'bundle':
          const { bundle_item_sku, bundle_item_quantity } = rule.parameters;
          const bundleItemPrice = products.find((product) => product.sku === bundle_item_sku)?.price || 0;
          const bundleItemQuantityInSkus = skus.filter((sku) => sku === bundle_item_sku).length;
          const bundleDiscount = Math.min(bundleItemQuantityInSkus, bundle_item_quantity * quantity) * bundleItemPrice;
          discount = Math.max(discount, bundleDiscount);
          break;
        default:
          break;
      }
    });
  }

  return discount;
}