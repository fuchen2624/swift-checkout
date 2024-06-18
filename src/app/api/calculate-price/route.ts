// pages/api/calculate-price.ts
import { NextRequest, NextResponse } from "next/server";
import { calculateDiscountedPrice } from '@/services/pricingService';
import { HttpStatusCode } from "axios";

export async function POST(req: NextRequest) {
    const { skus } = await req.json();
    console.debug("skus:" , skus)
    if (!Array.isArray(skus)) {
        return NextResponse.json(
            { error: "Invalid request. SKUs must be an array." },
            { status: HttpStatusCode.Unauthorized }
        );
    }

    const {totalPrice,discountedPrice} = await calculateDiscountedPrice(skus);
    return NextResponse.json({ totalPrice, discountedPrice });
}