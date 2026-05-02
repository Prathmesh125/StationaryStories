import { NextResponse } from 'next/server';

type Employee = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
};

// Sample in-memory employee data (Replace with DB)
const employees: Employee[] = [
  {
    id: 'E001',
    name: 'Om Chavan',
    position: 'Supervisor',
    email: 'omchavan@gmail.com',
    phone: '123-456-7890',
  },
  {
    id: 'E002',
    name: 'Jay Giri',
    position: 'Technician',
    email: 'jaygiri@gmail.com',
    phone: '098-765-4321',
  },
  {
    id: 'E003',
    name: 'Pratik Karande',
    position: 'Cashier',
    email: 'pratikk@gmail.com',
    phone: '555-555-5555',
  },
  {
    id: 'E004',
    name: 'Pranav Kubal',
    position: 'Manager',
    email: 'pranavkubal@gmail.com',
    phone: '111-222-3333',
  },
  {
    id: 'E005',
    name: 'Siddharth Mahore',
    position: 'Book Binder',
    email: 'siddharth676@gmail.com',
    phone: '444-444-4444',
  },
];

// GET - Fetch Employees
export async function GET() {
  return NextResponse.json(employees);
}

// POST - Add Employee
export async function POST(req: Request) {
  const { name, position, email, phone } = (await req.json()) as {
    name: string;
    position: string;
    email: string;
    phone: string;
  };

  if (!name || !position || !email || !phone) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 },
    );
  }

  const newEmployee: Employee = {
    id: `E00${employees.length + 1}`,
    name,
    position,
    email,
    phone,
  };

  employees.push(newEmployee);
  return NextResponse.json(newEmployee, { status: 201 });
}
