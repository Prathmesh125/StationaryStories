'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

interface salesDataType {
  name: string;
  total: number;
}

interface categoryDataType {
  name: string;
  value: number;
}

const salesData: salesDataType[] = [
  { name: 'Jan', total: 4500 },
  { name: 'Feb', total: 3800 },
  { name: 'Mar', total: 5200 },
  { name: 'Apr', total: 4800 },
  { name: 'May', total: 5500 },
  { name: 'Jun', total: 6000 },
];

const categoryData: categoryDataType[] = [
  { name: 'Xerox/Prints', value: 55 },
  { name: 'Stationary', value: 30 },
  { name: 'Books', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function Reports() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Report Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='sales'>Sales Report</SelectItem>
                  <SelectItem value='inventory'>Inventory Report</SelectItem>
                  <SelectItem value='financial'>Financial Report</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Time Period' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='daily'>Daily</SelectItem>
                  <SelectItem value='weekly'>Weekly</SelectItem>
                  <SelectItem value='monthly'>Monthly</SelectItem>
                  <SelectItem value='yearly'>Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button>Generate Report</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={salesData}>
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
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip />
                <Bar dataKey='total' fill='#adfa1d' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {categoryData.map((entry, index) => (
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
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Sales Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={salesData}>
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
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='total'
                stroke='#8884d8'
                name='Actual Sales'
              />
              <Line
                type='monotone'
                dataKey={(data: salesDataType) => Math.floor(data.total * 1.1)}
                stroke='#82ca9d'
                strokeDasharray='5 5'
                name='Predicted Sales'
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
