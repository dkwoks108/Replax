import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AdminLayout from '@/components/layouts/AdminLayout';
import Cookies from 'js-cookie';
import { parseCookies } from 'nookies';

interface DashboardError {
  message: string;
  code?: string;
}

interface DashboardProps {
  stats: DashboardStats;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customer: {
      name: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

const Dashboard = ({ stats }: DashboardProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DashboardError | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(stats);

  const refreshDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cookies = Cookies.get(); // gets all cookies as an object
      const token = cookies.token;
      
      if (!token) {
        throw { message: 'Authentication required', code: 'AUTH_REQUIRED' };
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw { message: 'Failed to fetch dashboard data', code: res.status.toString() };
      }

      const newStats = await res.json();
      setDashboardStats(newStats);
    } catch (err) {
      setError(err instanceof Error ? { message: err.message } : err as DashboardError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard - Replax</title>
      </Head>

      {loading && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error.message}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button
          onClick={refreshDashboard}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : 'Refresh Dashboard'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold mt-2">{dashboardStats.totalProducts}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{dashboardStats.totalOrders}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Low Stock Products</h3>
          <p className="text-3xl font-bold mt-2">{dashboardStats.lowStockProducts}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardStats.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (context) => {
  try {
    const cookies = parseCookies(context);
    const token = cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    // Fetch dashboard stats
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const stats: DashboardStats = await res.json();

    return {
      props: {
        stats,
      },
    };
  } catch (error) {
    console.error('Dashboard error:', error);
    
    // If it's an authentication error (no token or invalid token)
    if (error instanceof Error && error.message.toLowerCase().includes('unauthorized')) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    // For other errors, we'll show an error state in the dashboard
    return {
      props: {
        stats: {
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          lowStockProducts: 0,
          recentOrders: [],
        },
      },
    };
  }
};

export default Dashboard;