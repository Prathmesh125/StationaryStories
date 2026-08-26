/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
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
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface StockItem {
  name: string;
  current: number;
  reorder: number;
  predicted: number;
}

export function Stock() {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [formData, setFormData] = useState({ name: '', current: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch('/api/stock');
        if (!res.ok) throw new Error('Failed to fetch stock');
        const data: StockItem[] = await res.json();
        setStockData(data);
        await fetchPredictions(data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    }

    void fetchStock();
  }, []);

  async function fetchPredictions(stock: StockItem[]) {
    try {
      const prompt = `Predict next month's stock levels based on current values:\n${stock
        .map((item) => `${item.name}: ${item.current}`)
        .join('\n')}\nRespond in format: Product: prediction`;

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt }),
      });

      const json = await res.json();
      const text = json.response as string;

      const updated = [...stock];

      text.split('\n').forEach((line) => {
        const [name, val] = line.split(':').map((s) => s.trim());
        const index = updated.findIndex(
          (i) => i.name.toLowerCase() === (name ?? '').toLowerCase(),
        );
        if (index !== -1 && !isNaN(Number(val))) {
          if (updated[index]) {
            updated[index].predicted = Number(val);
          }
        }
      });

      setStockData(updated);
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
    }
  }

  async function handleUpdateStock(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, quantity: formData.current }),
      });
      if (!res.ok) throw new Error('Failed to update stock');
      const updatedStock = await res.json();
      setStockData(updatedStock);
      await fetchPredictions(updatedStock);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        
        // Call the vision API
        const res = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String, mimeType: file.type }),
        });

        if (!res.ok) throw new Error('Failed to process image');
        
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const items = data.items || [];
        
        // Update stock for each item
        let updatedStock = [...stockData];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        for (const item of items as any[]) {
          const stockRes = await fetch('/api/stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: item.name, quantity: item.quantity }),
          });
          if (stockRes.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            updatedStock = await stockRes.json();
          }
        }
        
        setStockData(updatedStock);
        await fetchPredictions(updatedStock);
      } catch (error) {
        console.error('Error uploading invoice:', error);
      } finally {
        setIsScanning(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stock Management</CardTitle>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
            >
              {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isScanning ? 'Scanning...' : 'Scan Invoice'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={handleUpdateStock}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <Input
                placeholder='Product Name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                placeholder='Quantity'
                type='number'
                value={formData.current}
                onChange={(e) =>
                  setFormData({ ...formData, current: Number(e.target.value) })
                }
              />
              <Button type='submit'>Update Stock</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.current}</TableCell>
                  <TableCell>{item.reorder}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.current > item.reorder ? 'success' : 'destructive'
                      }
                    >
                      {item.current > item.reorder ? 'In Stock' : 'Low Stock'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={stockData}>
                <XAxis dataKey='name' stroke='#888' fontSize={12} />
                <YAxis stroke='#888' fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey='current' fill='#8884d8' name='Current Stock' />
                <Bar dataKey='reorder' fill='#82ca9d' name='Reorder Level' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Stock Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={stockData}>
                <XAxis dataKey='name' stroke='#888' fontSize={12} />
                <YAxis stroke='#888' fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='current'
                  stroke='#8884d8'
                  name='Current Stock'
                />
                <Line
                  type='monotone'
                  dataKey='predicted'
                  stroke='#82ca9d'
                  strokeDasharray='5 5'
                  name='Predicted Stock'
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
