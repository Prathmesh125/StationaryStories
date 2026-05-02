/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Define Order Type
interface Order {
  id: string;
  customer: string;
  item: string;
  status: 'Pending' | 'Ordered' | 'Ready';
}

interface TrendData {
  name: string;
  prescriptions: number;
  predicted?: number;
}

const initialTrendData: TrendData[] = [
  { name: 'Mon', prescriptions: 45 },
  { name: 'Tue', prescriptions: 52 },
  { name: 'Wed', prescriptions: 49 },
  { name: 'Thu', prescriptions: 60 },
  { name: 'Fri', prescriptions: 55 },
  { name: 'Sat', prescriptions: 40 },
  { name: 'Sun', prescriptions: 37 },
];

export function Dispenser() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<Order>({
    id: '',
    customer: '',
    item: '',
    status: 'Pending',
  });
  const [trendData, setTrendData] = useState<TrendData[]>(initialTrendData);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = (await res.json()) as Order[];
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    async function fetchPredictedTrends() {
      try {
        const prompt = `Predict the number of prescriptions for the upcoming week. Use the same format: Day: value\n${initialTrendData
          .map((d) => `${d.name}: ${d.prescriptions}`)
          .join('\n')}`;

        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: prompt }),
        });

        const json = await res.json();
        const text = json.response as string;

        const updated = [...initialTrendData];
        text.split('\n').forEach((line) => {
          const [day, value] = line.split(':').map((s) => s.trim());
          const match = updated.find(
            (d) => d.name.toLowerCase() === (day ?? '').toLowerCase(),
          );
          if (match && !isNaN(Number(value))) {
            match.predicted = Number(value);
          }
        });

        setTrendData(updated);
      } catch (error) {
        console.error('AI prediction fetch error:', error);
      }
    }

    void fetchOrders();
    void fetchPredictedTrends();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add order');

      const newOrder = (await res.json()) as Order;
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setFormData({ id: '', customer: '', item: '', status: 'Pending' });
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Order Form */}
      <Card>
        <CardHeader>
          <CardTitle>Preorder Items</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <Input
                name='id'
                placeholder='Order ID'
                value={formData.id}
                onChange={handleChange}
                required
              />
              <Input
                name='customer'
                placeholder='Customer Name'
                value={formData.customer}
                onChange={handleChange}
                required
              />
              <Input
                name='item'
                placeholder='Item Name'
                value={formData.item}
                onChange={handleChange}
                required
              />
            </div>
            <Button type='submit'>Order Now</Button>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className='text-center'>
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.item}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'Ready'
                            ? 'default'
                            : order.status === 'Ordered'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Order Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={trendData}>
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
              />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='prescriptions'
                stroke='#8884d8'
                strokeWidth={2}
                name='Actual'
              />
              <Line
                type='monotone'
                dataKey='predicted'
                stroke='#82ca9d'
                strokeDasharray='5 5'
                strokeWidth={2}
                name='Predicted'
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
