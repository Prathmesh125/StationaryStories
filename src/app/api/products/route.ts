import { type NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

// Mock database (for now)
const products: Product[] = [
  { id: 'P001', name: 'College Files', category: 'Files', stock: 500, price: 15 },
  { id: 'P002', name: 'One Side Pages', category: 'Pages', stock: 3000, price: 5 },
  { id: 'P003', name: 'Two Side Pages', category: 'Pages', stock: 6000, price: 5 },
  { id: 'P004', name: 'Index', category: 'Pages', stock: 4000, price: 2 },
  { id: 'P005', name: 'A4 Notebooks', category: 'Notebooks', stock: 3500, price: 50 },
];

// Handle GET request (fetch all products)
export async function GET() {
  return NextResponse.json(products, { status: 200 });
}

// Handle POST request (add new product)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Product, 'id'>;
    const { name, category, stock, price } = body;

    if (!name || !category || stock === undefined || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct: Product = {
      id: `P${(products.length + 1).toString().padStart(3, '0')}`, // Generate unique ID
      name,
      category,
      stock,
      price,
    };
    products.push(newProduct);

    return NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
