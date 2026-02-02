'use client';
import Link from 'next/link';

const elLink = [
    ,{ id: 1, title: 'Dashboard', href: '/admin' }
    ,{ id: 2, title: 'Products', href: '/admin/products' }
    ,{ id: 3, title: 'Orders', href: '/admin/orders' }
    ,{ id: 4, title: 'Users', href: '/admin/users' }
    ,{ id: 5, title: 'Settings', href: '/admin/settings' }
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 left-0 w-[350px] h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-gray-800">
        Admin Panel
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {Object.values(elLink).map(item => (
          <Link
            key={item?.id}
            href={item?.href ?? ''}
            className="block px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            {item?.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
