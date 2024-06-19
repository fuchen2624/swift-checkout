import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { PricingRule } from '@/models/pricingRules';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseServiceKey!);

export async function GET(request: NextRequest) {

    const { data: rules, error } = await supabase
        .from<'pricing_rules', PricingRule>('pricing_rules')
        .select('*');

    if (error) {
        console.error('Error fetching pricing rules:', error);
        return NextResponse.json({ error: 'Failed to fetch pricing rules' }, { status: 500 });
    }

    return NextResponse.json({ rules });
}

export async function PUT(request: NextRequest) {
    const updatedRule = await request.json() as PricingRule;

    const { data, error } = await supabase
        .from('pricing_rules')
        .update(updatedRule)
        .match({ id: updatedRule.id });

    if (error) {
        console.error('Error updating pricing rule:', error);
        return NextResponse.json({ error: 'Failed to update pricing rule' }, { status: 500 });
    }

    return NextResponse.json({ rule: data });
}

export async function POST(request: NextRequest) {
    const newRule = await request.json() as PricingRule;

    const { data, error } = await supabase
        .from('pricing_rules')
        .insert(newRule);

    if (error) {
        console.error('Error creating pricing rule:', error);
        return NextResponse.json({ error: 'Failed to create pricing rule' }, { status: 500 });
    }

    return NextResponse.json({ rule: data });
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('id');

    if (!ruleId) {
        return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from<'pricing_rules', PricingRule>('pricing_rules')
        .delete()
        .eq('id', ruleId);

    if (error) {
        console.error('Error deleting pricing rule:', error);
        return NextResponse.json({ error: 'Failed to delete pricing rule' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Pricing rule deleted successfully' });
}