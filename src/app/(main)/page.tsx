'use client';

import React, { useState } from 'react';
import {
  PieChart,
  ShoppingCart,
  Book,
  Package,
  BarChart,
  BoxIcon,
  Users,
  Factory,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Purchase } from '@/components/purchase';
import { Dispenser } from '@/components/dispenser';
import { Product } from '@/components/product';
import { Reports } from '@/components/reports';
import { Stock } from '@/components/stock';
import { Customer } from '@/components/customer';
import { Manufacturer } from '@/components/manufacturer';
import { Employee } from '@/components/employee';
import { DashboardContent } from '@/components/dashboard-content';

const tabs = [
  { name: 'Dashboard', icon: PieChart },
  { name: 'Purchase', icon: ShoppingCart },
  { name: 'Orders', icon: Book },
  { name: 'Product', icon: Package },
  { name: 'Reports', icon: BarChart },
  { name: 'Stock', icon: BoxIcon },
  { name: 'Customer', icon: Users },
  { name: 'Manufacturer', icon: Factory },
  { name: 'Employee', icon: UserCircle },
];

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Purchase':
        return <Purchase />;
      case 'Orders':
        return <Dispenser />;
      case 'Product':
        return <Product />;
      case 'Reports':
        return <Reports />;
      case 'Stock':
        return <Stock />;
      case 'Customer':
        return <Customer />;
      case 'Manufacturer':
        return <Manufacturer />;
      case 'Employee':
        return <Employee />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar */}
      <aside className='w-64 bg-white p-4 shadow-md dark:bg-gray-800'>
        <div className='mb-8 flex items-center'>
          <PieChart className='mr-2 h-8 w-8 text-blue-500' />
          <span className='text-lg font-bold text-gray-800 dark:text-white'>
            Stationary Stories
          </span>
        </div>
        <nav className='space-y-2'>
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant={activeTab === tab.name ? 'default' : 'ghost'}
              className='w-full justify-start'
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon className='mr-2 h-5 w-5' />
              {tab.name}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-8'>
        {/* Header */}
        <header className='mb-8 flex items-center justify-between'>
        </header>

        {/* Active Component */}
        {renderActiveComponent()}
      </main>
    </div>
  );
}
