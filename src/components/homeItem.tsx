import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Sample data for demonstration
const categories = [
  { title: 'Vegetables & Fruits', icon: '/icons/vegetables.png' },
  { title: 'Grocery & Staples', icon: '/icons/grocery.png' },
  { title: 'Dairy & Eggs', icon: '/icons/dairy.png' },
  { title: 'Beverages', icon: '/icons/beverage.png' },
  { title: 'Snacks', icon: '/icons/snacks.png' },
  { title: 'Home Care', icon: '/icons/homecare.png' },
]

const featuredProducts = [
  {
    title: 'Cauliflower',
    price: '$12',
    oldPrice: '$15',
    discount: '6%',
    image: '/products/cauliflower.png',
  },
  {
    title: 'Strawberries',
    price: '$10',
    oldPrice: '$13',
    discount: '2%',
    image: '/products/strawberry.png',
  },
  {
    title: 'Mangosteen',
    price: '$5',
    oldPrice: '$8',
    discount: '5%',
    image: '/products/mangosteen.png',
  },
  {
    title: 'Carrots',
    price: '$15',
    oldPrice: '$20',
    discount: '3%',
    image: '/products/carrots.png',
  },
  {
    title: 'Bananas',
    price: '$9',
    oldPrice: '$10',
    discount: '2%',
    image: '/products/bananas.png',
  },
]
const offers = [
  {
    title: 'Daily Essentials',
    subtitle: 'MINIMUM 20% OFF EVERYDAY',
    image: '/images/essentials.png', // make sure this is in your public folder
    bgColor: 'bg-orange-500',
    button: null,
  },
  {
    title: 'GET UP TO 30% OFF',
    subtitle: '',
    image: '/images/grocery-bag.png',
    bgColor: 'bg-lime-400',
    button: {
      text: 'SHOP NOW',
      className: 'bg-black text-white px-3 py-1 text-sm rounded',
    },
  },
  {
    title: 'Special Discount for All Items',
    subtitle: 'SHOP NOW',
    image: '/images/fruits-offer.png',
    bgColor: 'bg-gray-100',
    countdown: '00 days 00:00:00',
    button: {
      text: 'SHOP NOW',
      className: 'bg-orange-500 text-white px-3 py-1 text-sm rounded',
    },
  },
]
export default function HomeHighlights() {
  return (
    <>
    
      <section className="space-y-10 px-4 lg:px-12 py-6">
        {/* Categories */}
        <div>
          <button>shop by</button>
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <Button variant="outline" size="icon">
              <ChevronLeft />
            </Button>
            {categories.map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center px-4 py-3 bg-white rounded-lg shadow-sm min-w-[120px]"
              >
                <img
                  src={cat.icon}
                  alt={cat.title}
                  className="w-10 h-10 mx-auto"
                />
                <p className="text-sm mt-2 text-center">{cat.title}</p>
              </div>
            ))}
            <Button variant="outline" size="icon">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>
      {/* offers */}
      <section className="px-4 py-6 space-y-4">
        <div>
          <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded">
            Offers
          </span>
          <h2 className="text-xl font-bold mt-2">Best Values</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`rounded-lg p-4 text-white relative ${offer.bgColor} flex flex-col justify-between`}
            >
              <div>
                <h3 className="text-xl font-bold">{offer.title}</h3>
                {offer.subtitle && (
                  <p className="text-sm mt-1">{offer.subtitle}</p>
                )}
              </div>
              <div className="flex justify-between items-end mt-4">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-24 object-contain"
                />
                {offer.button && (
                  <button className={offer.button.className}>
                    {offer.button.text}
                  </button>
                )}
              </div>
              {offer.countdown && (
                <p className="text-xs text-center mt-2 text-black font-semibold">
                  {offer.countdown}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bonus Cashback Banner */}
        <div className="bg-green-100 rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-green-800">
            Get $2 Cashback! Min Order of $22
          </h3>
          <p className="text-sm mt-2">
            <span className="bg-white text-orange-500 px-4 py-1 rounded-full font-medium border border-orange-500 inline-block">
              USE CODE : GAMBOSUPER2
            </span>
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-8 px-4 lg:px-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featuredProducts.map((product, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-4 text-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-cover mb-3"
              />
              <h4 className="font-semibold">{product.title}</h4>
              <p className="text-sm text-gray-500">Available (In Stock)</p>
              <div className="flex justify-center gap-2 text-sm mt-1">
                <span className="text-orange-600 font-bold">
                  {product.price}
                </span>
                <span className="line-through text-gray-400">
                  {product.oldPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-8 px-4 lg:px-12">
        <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg shadow-sm p-4 text-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-cover mb-3"
              />
              <h4 className="font-semibold">{product.title}</h4>
              <p className="text-sm text-gray-500">Available (In Stock)</p>
              <div className="flex justify-center gap-2 text-sm mt-1">
                <span className="text-orange-600 font-bold">
                  {product.price}
                </span>
                <span className="line-through text-gray-400">
                  {product.oldPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* footer */}
      <footer className="bg-gray-800 text-white py-6 px-4 lg:px-12 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Customer Service</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <p>
              Stay connected with us on social media for the latest updates and
              offers.
            </p>
            <p className="text-xs mt-2">
              <a href="#" className="text-orange-400 hover:underline">
                Facebook
              </a>{' '}
              |{' '}
              <a href="#" className="text-orange-400 hover:underline">
                Twitter
              </a>{' '}
              |{' '}
              <a href="#" className="text-orange-400 hover:underline">
                Instagram
              </a>
            </p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm">© 2023 Grocer Jet. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
