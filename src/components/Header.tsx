import { useAuth } from '@/hooks/UseAuth'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

export default function Header() {
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false)
  const { user } = useAuth()
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
        <div className="px-2 font-bold">
          <Link to="/auth/login">Login</Link>
        </div>
        <div className="relative px-2 font-bold">
          <button
            onClick={() => setIsDashboardDropdownOpen((open) => !open)}
            className="flex items-center gap-1 focus:outline-none"
          >
            Dashboard
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isDashboardDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDashboardDropdownOpen(false)}
                  activeProps={{ className: 'text-blue-600' }}
                >
                  Admin Dashboard
                </Link>
              )}
              {user?.role === 'customer' && (
                <Link
                  to="/customer"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDashboardDropdownOpen(false)}
                  activeProps={{ className: 'text-blue-600' }}
                >
                  Customer Dashboard
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
