import { NextResponse } from 'next/server';

const manufacturers = [
  {
    id: 'M001',
    name: 'Technical Publications',
    contact: 'Prathamesh Dawkar',
    email: 'prathamesh@technicalpub.com',
    phone: '123-456-7890',
  },
  {
    id: 'M002',
    name: 'Nirali Prakashan',
    contact: 'Ganesh Sejul',
    email: 'ganesh@niraliprakshan.com',
    phone: '098-765-4321',
  },
  {
    id: 'M003',
    name: 'TechKnowledge Publication',
    contact: 'Pritam Rangari',
    email: 'pritam@techknowledge.com',
    phone: '555-555-5555',
  },
  {
    id: 'M004',
    name: 'Tech Neo Publication',
    contact: 'Pratham Pagar',
    email: 'pratham@techneo.com',
    phone: '111-222-3333',
  },
];

export async function GET() {
  return NextResponse.json(manufacturers);
}

type Manufacturer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
};

export async function POST(req: Request) {
  const newManufacturer = await req.json() as Omit<Manufacturer, 'id'>;
  const manufacturerWithId: Manufacturer = {
    ...newManufacturer,
    id: `M${String(manufacturers.length + 1).padStart(3, '0')}`,
  };
  manufacturers.push(manufacturerWithId);
  return NextResponse.json(manufacturerWithId, { status: 201 });
}