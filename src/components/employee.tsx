'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

type Employee = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
};

const employeeRoleData = [
  { name: 'Supervisor', value: 2 },
  { name: 'Technician', value: 4 },
  { name: 'Cashier', value: 2 },
  { name: 'Manager', value: 3 },
];

export function Employee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = (await res.json()) as Employee[];
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    void fetchEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newEmployee = (await res.json()) as Employee;
      setEmployees([...employees, newEmployee]);
      setForm({ name: '', position: '', email: '', phone: '' });
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                name='name'
                placeholder='Name'
                value={form.name}
                onChange={handleChange}
                required
              />
              <Select
                name='position'
                onValueChange={(value) => setForm({ ...form, position: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder='Position' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Supervisor'>Supervisor</SelectItem>
                  <SelectItem value='Technician'>Technician</SelectItem>
                  <SelectItem value='Cashier'>Cashier</SelectItem>
                  <SelectItem value='Manager'>Manager</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name='email'
                type='email'
                placeholder='Email'
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name='phone'
                type='tel'
                placeholder='Phone'
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <Button type='submit'>Add Employee</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Employee Roles Distribution</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={employeeRoleData}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {employeeRoleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
