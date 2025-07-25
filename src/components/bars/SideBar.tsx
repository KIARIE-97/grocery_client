import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router' // Or your preferred routing library
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Home,
  PanelLeft,
  Package2,
  Users2,
  LineChart,
  Package,
  ShoppingCart,
  MapPin,
  Star,
  FileText,
  BadgePercent,
  LogOut,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { useLogoutUser } from '@/hooks/useLogin'
import { toast } from 'sonner'
import { Wallet } from 'lucide-react'
import { useAuth } from '@/hooks/UseAuth'

// Define types for our menu items
interface SubMenuItem {
  label: string
  url: string
}

interface MenuItem {
  label: string
  icon: LucideIcon 
  url: string
  badge?: string | null
  subItems?: SubMenuItem[]
}

const customerMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    url: '/customer',
  },
  {
    label: 'My Orders',
    icon: ShoppingCart,
    url: '/customer/orderdetail',
  },
  {
    label: 'My Address',
    icon: MapPin,
    url: '/customer/address',
  },
  {
    label: 'My Wallet',
    icon: Wallet,
    url: '/customer/mywallet',
  },
]


const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    url: '/admin',
    badge: null,
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
    url: '/admin/orders',
    badge: '2',
  },
  {
    label: 'Products',
    icon: Package,
    url: '/admin/product',
    badge: null,
  },
  {
    label: 'Customers',
    icon: Users2,
    url: '/admin/customers',
    badge: null,
  },
  {
    label: 'Drivers',
    icon: LineChart,
    url: '/admin/drivers',
    badge: null,
  },
  {
    label: 'Category',
    icon: LineChart,
    url: '/admin/category',
    badge: null,
  },
  {
    label: 'Store',
    icon: LineChart,
    url: '/admin/stores',
    badge: null,
  },
  // {
  //   label: 'Locations',
  //   icon: MapPin,
  //   url: '/admin/locations',
  //   subItems: [
  //     { label: 'All Locations', url: '#' },
  //     { label: 'Add New', url: '#' },
  //   ],
  // },
  // {
  //   label: 'Feedback',
  //   icon: Star,
  //   url: '/admin/ratings',
  //   badge: null,
  // },
  // {
  //   label: 'Pages',
  //   icon: FileText,
  //   url: '/admin/pages',
  //   badge: null,
  // },
  {
    label: 'Profile',
    icon: BadgePercent,
    url: '/admin/profile',
    badge: null,
  },
]

const storeOwnerMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    url: '/store_owner',
    badge: null,},
    {
    label: 'Products',
    icon: Package,
    url: '/store_owner/product',
    badge: null,
    },
    {
    label: 'Orders',
    icon: ShoppingCart,
    url: '/store_owner/order',
    badge: null,
    }
]
const DriversMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    url: '/driver',
    badge: null,
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
    url: '/driver/orders',
    badge: null,
  },
  {
    label: 'Profile',
    icon: BadgePercent,
    url: '/driver/profile',
    badge: null,
  },
]

const Sidebar: React.FC = () => {
     const logout = useLogoutUser()
       const navigate = useNavigate()
       const { user } = useAuth()

     // logout
       const handleLogout = async () => {
         try {
           await logout.mutateAsync()
           toast.success('Logged out successfully!')
           navigate({ to: '/' })
         } catch (error) {
           toast.error('Logout failed. Please try again.')
         }
       }
      let itemsToShow: MenuItem[] = menuItems
      if (user?.role === 'customer') {
        itemsToShow = customerMenuItems
      } else if (user?.role === 'store_owner') {
        itemsToShow = storeOwnerMenuItems
      } else if (user?.role === 'driver') {
        itemsToShow = DriversMenuItems
      }
  
  return (
    <div className="relative min-h-screen w-full md:w-64 bg-blue-950">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-blue-950/40 md:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="text-gray-100">GrocerJet</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {itemsToShow.map((item, index) =>
                item.subItems ? (
                  <Collapsible key={index} className="grid gap-2">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-between"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.url}
                          className="ml-7 flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    key={index}
                    to={item.url}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-100 transition-all hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50 ${
                      item.label === 'Dashboard' &&
                      'bg-gray-500 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ),
              )}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button onClick={handleLogout} size="sm" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="sm:hidden absolute top-4 left-4"
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">GrocerJet</span>
            </Link>
            {menuItems.map(
              (item, index) =>
                !item.subItems && (
                  <Link
                    key={index}
                    to={item.url}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ),
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Sidebar
