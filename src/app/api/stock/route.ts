import { NextResponse } from 'next/server';

const stockData = [
  { name: 'Engineering Maths 1', current: 500, reorder: 100, predicted: 450 },
  { name: 'Engineering Maths 2', current: 300, reorder: 50, predicted: 280 },
  { name: 'Engineering Chemistry', current: 600, reorder: 150, predicted: 580 },
  { name: 'Engineering Physics', current: 400, reorder: 75, predicted: 420 },
  { name: 'Engineering Mechanics', current: 200, reorder: 40, predicted: 190 },
];

// GET request to fetch stock data
export async function GET() {
  return NextResponse.json(stockData);
}

// POST request to update stock data
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name: string; quantity: number };
    const { name, quantity } = body;
    const itemIndex = stockData.findIndex((item) => item.name === name);

    if (itemIndex !== -1) {
      if (stockData[itemIndex]) {
        stockData[itemIndex].current += quantity;
      }
    } else {
      stockData.push({
        name,
        current: quantity,
        reorder: 50,
        predicted: quantity,
      });
    }

    return NextResponse.json(stockData);
  } catch {
    return NextResponse.json({ error: 'An error occurred while updating stock' }, { status: 500 });
  }
}
