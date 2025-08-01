import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { authStore } from '@/store/authStore';
import { Link, useLocation } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useState } from 'react';
import CartSidebar from './CartSidebar';



function Navbar({ onCartClick }: { onCartClick?: () => void }) {
  const isSignedIn = useStore(authStore, (state) => state.isAuthenticated)
  const foundUser = useStore(authStore, (state) => state.user)
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const dashboardRoutes: Record<string, string> = {
    customer: '/customer',
    driver: '/driver',
    admin: '/admin',
    store_owner: '/store_owner',
  }
  // Add this line:
  const dashboardRoute = foundUser?.role
    ? dashboardRoutes[foundUser.role] || '/customer'
    : '/customer'
  const location = useLocation()

  // Helper to format the current route
  const getRouteLabel = () => {
    // Remove leading slash and split by "/"
    const parts = location.pathname.replace(/^\//, '').split('/')
    return parts.join(' / ') || 'dashboard'
  }

  return (
    <div>
      {/* Top Bar */}
      <div className="flex flex-col w-full bg-white border-b shadow-sm px-4 py-2">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="  flex flex-row gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.HUhGmeR3uzqXwLg1d3nqnAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Logo"
                className="h-10"
              />
              <span className="text-[#7A871E] font-bold text-lg">
                Grocer Jet
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
          </div>

          {/* Top Info */}
          <div className="hidden md:flex items-center gap-6 text-sm text-[#104210]">
            <span>Offers</span>
            <span>Help</span>

            {isSignedIn ? (
              <>
                <div className="relative">
                  <div className="w-6 h-6 p-6  flex items-center justify-center text-xs font-bold text-orange-500">
                    <Link to={dashboardRoute}>dashboard</Link>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/014/277/912/original/trendy-stylish-girl-vector.jpg"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{foundUser?.full_name}</span>
                </div>

                {showCartSidebar && (
                  <div className="fixed top-0 right-0 z-50">
                    <CartSidebar onClose={() => setShowCartSidebar(false)} />
                  </div>
                )}
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  onClick={() => setShowCartSidebar((prev) => !prev)}
                >
                  <span className="text-black font-semibold">Cart</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link to="/auth/register">
                  <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-800 text-sm font-semibold w-full sm:w-auto">
                    SIGN UP
                  </button>
                </Link>
                <div className="flex items-center w-full sm:w-auto border border-gray-300 rounded overflow-hidden bg-white"></div>
                <Link to="/auth/login">
                  <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-800 text-sm font-semibold w-full sm:w-auto">
                    SIGN IN
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-700 overflow-x-auto">
          <div className="mt-4 flex items-center justify-start gap-6 text-sm text-gray-700 overflow-x-auto">
            {isSignedIn && location.pathname !== '/' ? (
              <span className="font-semibold">/ {getRouteLabel()}</span>
            ) : (
              <>
                <span className="font-semibold">Select Category</span>
                <NavigationMenu>
                  <NavigationMenuList className="flex gap-4">
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        href="/"
                        className="text-orange-500 font-semibold"
                      >
                        Home
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/allstores">
                        our stores
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/featuredproducts">
                        Featured Products
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="/about">
                        About Us
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink href="/contact">
                        Contact Us
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
