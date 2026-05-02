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
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface Manufacturer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

const manufacturerOrderData = [
  { name: 'Technical Publications', orders: 50 },
  { name: 'Nirali Prakashan', orders: 40 },
  { name: 'TechKnowledge Publication', orders: 30 },
  { name: 'Tech Neo Publication', orders: 45 },
];

export function Manufacturer() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const res = await fetch('/api/manufacturers');
        const data = (await res.json()) as Manufacturer[];
        setManufacturers(data);
      } catch (error) {
        console.error('Failed to fetch manufacturers:', error);
      }
    };
    void fetchManufacturers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/manufacturers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const newManufacturer = (await res.json()) as Manufacturer;
    setManufacturers([...manufacturers, newManufacturer]);
    setFormData({ name: '', contact: '', email: '', phone: '' });
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Add New Manufacturer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Manufacturer Name'
                required
              />
              <Input
                name='contact'
                value={formData.contact}
                onChange={handleChange}
                placeholder='Contact Person'
                required
              />
              <Input
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email'
                required
              />
              <Input
                name='phone'
                type='tel'
                value={formData.phone}
                onChange={handleChange}
                placeholder='Phone'
                required
              />
            </div>
            <Button type='submit'>Add Manufacturer</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manufacturer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufacturers.map((manufacturer) => (
                <TableRow key={manufacturer.id}>
                  <TableCell>{manufacturer.id}</TableCell>
                  <TableCell>{manufacturer.name}</TableCell>
                  <TableCell>{manufacturer.contact}</TableCell>
                  <TableCell>{manufacturer.email}</TableCell>
                  <TableCell>{manufacturer.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manufacturer Order Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={manufacturerOrderData}>
              <XAxis
                dataKey='name'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Bar dataKey='orders' fill='#8884d8' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
