import { type NextRequest, NextResponse } from 'next/server';

interface Purchase {
  supplier: string;
  amount: number;
  date: string;
}

const purchaseData: Purchase[] = [
  {
    supplier: 'TechKnowledge Engineering Mechanics',
    amount: 5000,
    date: '2023-06-01',
  },
  {
    supplier: 'Technical Publications Engineering Chemistry',
    amount: 3500,
    date: '2023-06-05',
  },
  {
    supplier: 'Nirali Prakashan Engineering Physics',
    amount: 4200,
    date: '2023-06-10',
  },
  {
    supplier: 'Tech Neo Engineering Maths 2',
    amount: 2800,
    date: '2023-06-15',
  },
];

// GET Request - Fetch purchases
export async function GET() {
  return NextResponse.json(purchaseData);
}

// POST Request - Add a new purchase
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Purchase;
    
    if (!body.supplier || !body.amount || !body.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    purchaseData.push(body);
    return NextResponse.json({ message: 'Purchase added successfully', data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
