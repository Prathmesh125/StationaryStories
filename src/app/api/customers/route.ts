import { NextResponse } from 'next/server';

const customers = [
  {
    id: 'C001',
    name: 'Ayush Virulkar',
    email: 'ayush@gmail.com',
    phone: '123-456-7890',
    lastPurchase: '2023-06-15',
  },
  {
    id: 'C002',
    name: 'Swaroop Patil',
    email: 'swaroop@gmail.com',
    phone: '098-765-4321',
    lastPurchase: '2023-06-10',
  },
  {
    id: 'C003',
    name: 'Manish Narkhede',
    email: 'manish@gmail.com',
    phone: '555-555-5555',
    lastPurchase: '2023-06-20',
  },
  {
    id: 'C004',
    name: 'Ashish Kharde',
    email: 'ashish@gmail.com',
    phone: '111-222-3333',
    lastPurchase: '2023-06-18',
  },
  {
    id: 'C005',
    name: 'Karan Nigal',
    email: 'karan@gmail.com',
    phone: '444-444-4444',
    lastPurchase: '2023-06-22',
  },
];

export async function GET() {
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name: string;
      email: string;
      phone: string;
      lastPurchase: string;
    };

    if (!body.name || !body.email || !body.phone || !body.lastPurchase) {
      return NextResponse.json({ error: 'Invalid customer data' }, { status: 400 });
    }

    const newCustomer = {
      id: `C00${customers.length + 1}`,
      ...body,
    };

    customers.push(newCustomer);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
