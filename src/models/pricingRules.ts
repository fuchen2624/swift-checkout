import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface PricingRule {
  id: number;
  sku: string;
  type: string;
  parameters: any;
}

export async function getPricingRules(sku: string): Promise<PricingRule[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseServiceKey!);
  const { data: rules, error } = await supabase
    .from<'pricing_rules', PricingRule>('pricing_rules')
    .select('*')
    .eq('sku', sku);

  if (error) {
    console.error('Error fetching pricing rules:', error);
    return [];
  }

  return rules as PricingRule[];
}