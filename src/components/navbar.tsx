import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { authStore } from '@/store/authStore';
import { useLocation } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';


function Navbar() {
  const isSignedIn = useStore(authStore, (state) => state.isAuthenticated); 
  const foundUser = useStore(authStore, (state) => state.user) 

  console.log('Found User:', foundUser?.full_name);
  const location = useLocation();

  // Helper to format the current route
  const getRouteLabel = () => {
    // Remove leading slash and split by "/"
    const parts = location.pathname.replace(/^\//, "").split("/");
    return parts.join(" / ") || "dashboard";
  };


  return (
    <div>
      {/* Top Bar */}
      <div className="flex flex-col w-full bg-white border-b shadow-sm px-4 py-2">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="h-10" />
            <span className="text-green-600 font-bold text-lg">Grocer Jet</span>
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
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <span>Offers</span>
            <span>Help</span>

            {isSignedIn &&  (
              <>
                <div className="relative">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-500">
                    1
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/images/avatar.png"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{foundUser?.full_name}</span>
                </div>
                <div className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  Cart 2
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="mt-4 flex items-center justify-start gap-6 text-sm text-gray-700 overflow-x-auto">
          
        <div className="mt-4 flex items-center justify-start gap-6 text-sm text-gray-700 overflow-x-auto">
        {isSignedIn ? (
          <span className="font-semibold">
           / {getRouteLabel()}
          </span>
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
                <NavigationMenuLink href="/new-products">
                  New Products
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/featured-products">
                  Featured Products
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/blog">Blog</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/pages">Pages</NavigationMenuLink>
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
