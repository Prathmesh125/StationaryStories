import { NextResponse } from 'next/server';

interface Order {
  id: string;
  customer: string;
  item: string;
  status: 'Pending' | 'Ordered' | 'Ready'; // Restrict valid statuses
}

// Mutable orders array (avoids issues in serverless environments)
// eslint-disable-next-line prefer-const
let orders: Order[] = [
  {
    id: 'RX001',
    customer: 'Ayush Virulkar',
    item: 'Engineering Physics',
    status: 'Ready',
  },
  {
    id: 'RX002',
    customer: 'Swaroop Patil',
    item: 'Casio FX991 ES Plus',
    status: 'Ordered',
  },
  {
    id: 'RX003',
    customer: 'Manish Narkhede',
    item: 'Engineering Mechanics',
    status: 'Pending',
  },
  {
    id: 'RX004',
    customer: 'Niraj Shevade',
    item: 'Theory of Computation',
    status: 'Ready',
  },
  {
    id: 'RX005',
    customer: 'Karan Nigal',
    item: 'Head First Java',
    status: 'Ordered',
  },
];

// GET: Fetch all orders
export async function GET() {
  return NextResponse.json(orders);
}

// POST: Create a new order
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Order>;
    const { id, customer, item, status } = body;

    // Validate required fields
    if (!id || !customer || !item || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate status value
    if (!['Pending', 'Ordered', 'Ready'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 },
      );
    }

    // Create and store new order
    const newOrder: Order = { id, customer, item, status };
    orders.push(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
