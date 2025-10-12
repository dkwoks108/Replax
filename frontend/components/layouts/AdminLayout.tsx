import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    typeof window !== 'undefined' && router.push('/admin/login');
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Blog Posts', href: '/admin/blog' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Replax Admin</h1>
        </div>
        <div className="mt-8">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <a
                className={`block px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${
                  router.pathname === item.href ? 'bg-gray-50 text-gray-900 border-l-4 border-primary' : ''
                }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {navigation.find((item) => item.href === router.pathname)?.name || 'Admin Panel'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;