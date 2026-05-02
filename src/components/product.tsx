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
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState({
    name: '',
    category: '',
    stock: '',
    price: '',
  });

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    void fetchProducts();
  }, []);

  // Handle form input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Handle adding a new product
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newProduct = {
        name: form.name,
        category: form.category,
        stock: Number(form.stock) || 0,
        price: Number(form.price) || 0,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Failed to add product');

      const { product } = (await response.json()) as { product: Product };

      // Update state without requiring refresh
      setProducts((prev) => [...prev, product]);

      // Reset form
      setForm({ name: '', category: '', stock: '', price: '' });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={handleAddProduct}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Input
                name='name'
                value={form.name}
                onChange={handleChange}
                placeholder='Product Name'
              />
              <Input
                name='category'
                value={form.category}
                onChange={handleChange}
                placeholder='Category'
              />
              <Input
                name='stock'
                value={form.stock}
                onChange={handleChange}
                placeholder='Stock'
                type='number'
              />
              <Input
                name='price'
                value={form.price}
                onChange={handleChange}
                placeholder='Price'
                type='number'
                step='0.01'
              />
            </div>
            <Button type='submit'>Add Product</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stock > 100 ? 'default' : 'destructive'
                        }
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart
              data={products.map((p) => ({ name: p.name, sales: p.stock }))}
            >
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
              <Bar dataKey='sales' fill='#8884d8' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
