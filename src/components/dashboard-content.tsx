/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { IndianRupee, Boxes, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const revenueData = [
  { name: 'Jan', total: 4500 },
  { name: 'Feb', total: 3800 },
  { name: 'Mar', total: 5200 },
  { name: 'Apr', total: 4800 },
  { name: 'May', total: 5500 },
  { name: 'Jun', total: 6000 },
];

const categoryData = [
  { name: 'Xerox/Prints', value: 55 },
  { name: 'Stationary', value: 30 },
  { name: 'Books', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// List of potential stationery items for generating insights
const stationeryItems = [
  'notebooks',
  'pens',
  'pencils',
  'highlighters',
  'staplers',
  'paper clips',
  'sticky notes',
  'erasers',
  'rulers',
  'binders',
  'file folders',
  'markers',
  'color pencils',
  'scissors',
  'glue sticks',
  'tape',
  'whiteout',
  'index cards',
  'graph paper',
  'printing paper',
];

export function DashboardContent() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: generateInsightPrompt(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();

      if (data.response) {
        // Split the response by line breaks and filter out empty lines
        const newInsights = data.response
          .split('\n')
          .filter((line: string) => line.trim() !== '')
          .map((line: string) => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering if present
          .slice(0, 4); // Limit to 4 insights

        setInsights(newInsights);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setInsights([
        'Sales of Graphic Sheets have increased by 25% this week. Consider stocking up.',
        'The new Printer has reduced wait times by 40%.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateInsightPrompt = () => {
    // Randomly select 3-5 stationery items
    const shuffled = [...stationeryItems].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);

    return `Generate 4 brief, specific business insights about stationery items for a campus stationery shop owner. 
    Focus on these items: ${selectedItems.join(', ')}. 
    Each insight should be a single sentence suggesting an actionable opportunity, trend, or observation. 
    Make the insights data-driven with specific percentages or numbers. 
    Return only the insights without any introductions or explanations, one per line.`;
  };

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <IndianRupee className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>₹25,2310.89</div>
            <p className='text-xs text-muted-foreground'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Inventory Value
            </CardTitle>
            <Boxes className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>₹12,2340.56</div>
            <p className='text-xs text-muted-foreground'>
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Customers
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+573</div>
            <p className='text-xs text-muted-foreground'>
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <ResponsiveContainer width='100%' height={350}>
              <BarChart data={revenueData}>
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
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Distribution of sales across product categories
            </CardDescription>
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>AI Insights</CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={fetchInsights}
            disabled={loading}
            className='flex items-center gap-2'
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Insights'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className='flex items-start space-x-2'>
                  <Badge variant='secondary' className='mt-0.5'>
                    AI
                  </Badge>
                  <p>{insight}</p>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Loading AI insights...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
