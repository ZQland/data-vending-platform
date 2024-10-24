// app/api/datasets/purchase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '../../../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(req: NextRequest) {
  const { dataset_id } = await req.json();

  try {
    const result = await query('SELECT * FROM datasets WHERE id = $1', [dataset_id]);
    const dataset = result.rows[0];

    if (!dataset) {
      return NextResponse.json({ message: 'Dataset not found' }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: dataset.title,
          },
          unit_amount: dataset.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    await query('INSERT INTO transactions (buyer_id, dataset_id, transaction_amount) VALUES ($1, $2, $3)', [
      1, dataset_id, dataset.price, // Example user ID, replace with real user ID from authentication
    ]);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create payment session' }, { status: 500 });
  }
}
