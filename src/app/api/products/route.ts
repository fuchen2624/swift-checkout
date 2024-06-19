import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/products';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseServiceKey!);

export async function GET(request: NextRequest) {
    const { data: products, error } = await supabase
        .from<'products', Product>('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    return NextResponse.json({ products });
}