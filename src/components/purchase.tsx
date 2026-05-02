'use client';

import { useState, useEffect } from 'react';
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
import { Package, Tag, IndianRupee } from 'lucide-react';

interface Purchase {
  supplier: string;
  amount: number;
  date: string;
}

export function Purchase() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [supplier, setSupplier] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  // Fetch purchase data from API
  useEffect(() => {
    fetch('/api/purchases')
      .then((res) => res.json())
      .then((data: Purchase[]) => setPurchases(data))
      .catch((err) => console.error('Error fetching purchases:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalAmount = Number(quantity) * Number(unitPrice);

    const newPurchase: Purchase = {
      supplier,
      amount: totalAmount,
      date: new Date().toISOString().split('T')[0] ?? '',
    };

    const response = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPurchase),
    });

    if (response.ok) {
      setPurchases((prev) => [...prev, newPurchase]);
      setSupplier('');
      setProduct('');
      setQuantity('');
      setUnitPrice('');
    }
  };

  const purchaseChartData = purchases.map((p, index) => ({
    name: `Order ${index + 1}`,
    total: p.amount,
  }));

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>New Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center space-x-2'>
                <Package className='h-4 w-4 text-gray-600' />
                <Input placeholder='Supplier' value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
              </div>
              <div className='flex items-center space-x-2'>
                <Tag className='h-4 w-4 text-gray-600' />
                <Input placeholder='Product' value={product} onChange={(e) => setProduct(e.target.value)} required />
              </div>
              <div className='flex items-center space-x-2'>
                <IndianRupee className='h-4 w-4 text-gray-600' />
                <Input placeholder='Quantity' type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
              <div className='flex items-center space-x-2'>
                <IndianRupee className='h-4 w-4 text-gray-600' />
                <Input placeholder='Unit Price' type='number' step='0.01' value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
              </div>
            </div>
            <Button type='submit'>Create Purchase Order</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell>{purchase.supplier}</TableCell>
                  <TableCell>₹{purchase.amount.toFixed(2)}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={purchaseChartData}>
              <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `₹${value}`} />
              <Tooltip formatter={(value: number) => `₹${value}`} />
              <Bar dataKey='total' fill='#22c55e' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
