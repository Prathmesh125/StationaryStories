import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Stock from '@/models/Stock';

export async function GET() {
  try {
    await connectDB();
    const stockData = await Stock.find({});
    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = (await req.json()) as { name: string; quantity: number };
    const { name, quantity } = body;

    if (!name) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    let stockItem = await Stock.findOne({ name });
    
    if (stockItem) {
      stockItem.current += quantity;
      await stockItem.save();
    } else {
      stockItem = await Stock.create({
        name,
        current: quantity,
        reorder: 50,
        predicted: quantity,
      });
    }

    const allStock = await Stock.find({});
    return NextResponse.json(allStock);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'An error occurred while updating stock' }, { status: 500 });
  }
}
