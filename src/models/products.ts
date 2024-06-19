import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Product {
  sku: string;
  name: string;
  price: number;
}

export async function getProducts(): Promise<Product[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseServiceKey!);
  const { data: products, error } = await supabase
    .from<'products', Product>('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products as Product[];
}
