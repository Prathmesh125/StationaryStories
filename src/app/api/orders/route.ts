import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find();
    
    const formattedOrders = orders.map(order => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      id: order._id.toString(),
      customer: order.customer,
      item: order.item,
      status: order.status
    }));
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { customer, item, status } = body; 

    if (!customer || !item) {
      return NextResponse.json(
        { error: 'Missing required fields: customer, item' },
        { status: 400 },
      );
    }

    const newOrder = await Order.create({
      customer,
      item,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      status: status || 'Pending'
    });

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      id: newOrder._id.toString(),
      customer: newOrder.customer,
      item: newOrder.item,
      status: newOrder.status
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
