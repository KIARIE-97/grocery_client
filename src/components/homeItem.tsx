import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useCategories } from '@/hooks/useCategory'
import {  useState } from 'react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

const hoverEffect = {
  scale: 1.03,
  transition: { duration: 0.3 },
}

const tapEffect = {
  scale: 0.98,
}

const offers = [
  {
    title: 'Super Saver',
    subtitle: 'Save up to 30% on select items',
    image:
      'https://img.freepik.com/premium-photo/fresh-fruits-vegetables-dairy-products-spilling-out-shopping-basket-symbolizing-healthy-living-against-sunny-yellow-backdrop_1162141-27755.jpg',
    bgColor: 'bg-[#E15B18]',
    button: {
      text: 'Shop Now',
      className: 'bg-white text-orange-500 px-4 py-2 rounded font-bold mt-2',
    },
    countdown: 'Ends in 2 days',
  },
  {
    title: 'Flash Sale',
    subtitle: 'Limited time deals',
    image:
      'https://www.mlocal.be/oktThemes/ra161-s/images/accueil/image-bloc3.jpg',
    bgColor: 'bg-[#C9AB3D]',
    button: {
      text: 'Grab Deal',
      className: 'bg-white text-blue-500 px-4 py-2 rounded font-bold mt-2',
    },
    countdown: 'Ends in 5 hours',
  },
  {
    title: 'Buy 1 Get 1',
    subtitle: 'On selected products',
    image:
      'https://tse1.mm.bing.net/th/id/OIP.NZjY08At7cyT7-6qBEPL2AHaFi?rs=1&pid=ImgDetMain&o=7&rm=3',
    bgColor: 'bg-purple-500',
    button: {
      text: 'View Products',
      className: 'bg-white text-purple-500 px-4 py-2 rounded font-bold mt-2',
    },
    countdown: 'Ends in 1 day',
  },
]

const featuredProducts = [
  {
    title: 'Cauliflower',
    price: 'KES 12',
    oldPrice: 'KES 15',
    discount: '6%',
    image:
      'https://th.bing.com/th/id/R.4e68deca39eba68fc84b94162ef4b3ee?rik=NjJrdKCPTQlFAw&riu=http%3a%2f%2fwww.fooduniversity.com%2ffoodu%2fproduce_c%2fproducereference%2fResources%2fField+Veg%2fCauliflower%2fcauliflower.jpg&ehk=TwYtTV9vHuvZuD7ENeqykTxXr%2bqTfhr6cHgrclwBrZE%3d&risl=&pid=ImgRaw&r=0',
  },
  {
    title: 'Strawberries',
    price: 'KES 10',
    oldPrice: 'KES 13',
    discount: '2%',
    image:
      'https://tse4.mm.bing.net/th/id/OIP.BzG-ziCM31ewI2oQISb3oQHaGX?w=1280&h=1100&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    title: 'Mangosteen',
    price: 'KES 5',
    oldPrice: 'KES 8',
    discount: '5%',
    image:
      'https://www.newbodyandmind.com/wp-content/uploads/2022/03/Queen-of-fruits-Thai-cosmetics-firm-sees-vast-potential-for-mangosteen-extract.jpg',
  },
  {
    title: 'Carrots',
    price: 'KES 15',
    oldPrice: 'KES 20',
    discount: '3%',
    image:
      'https://tse1.explicit.bing.net/th/id/OIP.MY6Z5py7_OZn8NcfPiJ4swHaIr?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    title: 'Bananas',
    price: 'KES 9',
    oldPrice: 'KES 10',
    discount: '2%',
    image:
      'https://www.tastingtable.com/img/gallery/the-real-difference-between-bananas-and-baby-bananas/l-intro-1663622196.jpg',
  },
]


export default function HomeHighlights() {
  const { data: categoriesDataRaw } = useCategories()
  console.log('categories data', categoriesDataRaw)
  const categoriesData = Array.isArray(categoriesDataRaw)
    ? categoriesDataRaw
    : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(categoriesData.length / itemsPerPage)

  const visibleCategories = categoriesData.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  )

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  return (
    <div>
      <motion.section
        className="space-y-10 px-4 lg:px-12 py-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Categories Section with Carousel */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={tapEffect}
                className="text-sm font-medium text-gray-500"
              >
                shop by
              </motion.button>
              <h2 className="text-2xl font-bold">Categories</h2>
            </div>

            {totalPages > 1 && (
              <div className="flex gap-2">
                <motion.button
                  onClick={prevSlide}
                  whileHover={hoverEffect}
                  whileTap={tapEffect}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  onClick={nextSlide}
                  whileHover={hoverEffect}
                  whileTap={tapEffect}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            )}
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                  exit: { opacity: 0 },
                }}
              >
                {visibleCategories.map((cat, i) => (
                  <motion.div
                    key={`${currentIndex}-${i}`}
                    variants={itemVariants}
                    whileHover={hoverEffect}
                    whileTap={tapEffect}
                  >
                    <Link
                      to="/productdetails"
                      params={{ productId: cat.id }}
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm h-full"
                    >
                      <motion.img
                        src={cat.image}
                        alt={cat.category_name}
                        className="w-40 h-40 mx-auto object-contain mb-2"
                        whileHover={{ scale: 1.1 }}
                      />
                      <p className="text-sm font-medium text-center">
                        {cat.category_name}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Offers Section (unchanged) */}
        <motion.section
          className="px-4 py-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div whileHover={{ x: 5 }}>
            <span className="#FF5C4D text-white text-sm px-2 py-1 rounded">
              Offers
            </span>
            <h2 className="text-xl font-bold mt-2">Best Values</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                className={`rounded-lg p-4 text-white relative ${offer.bgColor} flex flex-col justify-between`}
              >
                <div>
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                  {offer.subtitle && (
                    <p className="text-sm mt-1">{offer.subtitle}</p>
                  )}
                </div>
                <div className="flex justify-between items-end mt-4 rounded-2xl p-2">
                  <motion.img
                    src={offer.image}
                    alt={offer.title}
                    className="h-24 object-contain rounded-lg mx-auto shadow-md"
                    whileHover={{ scale: 1.05 }}
                  />
                  {offer.button && (
                    <motion.button
                      className={offer.button.className}
                      whileHover={{ scale: 1.05 }}
                      whileTap={tapEffect}
                    >
                      {offer.button.text}
                    </motion.button>
                  )}
                </div>
                {offer.countdown && (
                  <p className="text-xs text-center mt-2 text-black font-semibold">
                    {offer.countdown}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Bonus Cashback Banner */}
          <motion.div
            className="bg-green-100 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-green-800">
              Get KES 200 Cashback! Min Order of KES 500
            </h3>
            <motion.p className="text-sm mt-2" whileHover={{ scale: 1.05 }}>
              <span className="bg-white text-orange-500 px-4 py-1 rounded-full font-medium border border-orange-500 inline-block">
                USE CODE : GAMBOSUPER2
              </span>
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Featured Products Section (unchanged) */}
        <motion.section
          className="bg-gray-50 py-8 px-4 lg:px-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredProducts.map((product, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                className="bg-white rounded-lg shadow-sm p-4 text-center"
              >
                <motion.img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-50 object-cover mb-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                />
                <h4 className="font-semibold">{product.title}</h4>
                <p className="text-sm text-gray-500">Available (In Stock)</p>
                <div className="flex justify-center gap-2 text-sm mt-1">
                  <span className="text-[#FF5C4D] font-bold">{product.price}</span>
                  <span className="line-through text-gray-400">
                    {product.oldPrice}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Special Offers Section (unchanged) */}
        <motion.section
          className="bg-white py-8 px-4 lg:px-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredProducts.map((product, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                className="bg-gray-100 rounded-lg shadow-sm p-4 text-center"
              >
                <motion.img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-50 object-cover mb-3"
                  whileHover={{ scale: 1.05 }}
                />
                <h4 className="font-semibold">{product.title}</h4>
                <p className="text-sm text-gray-600">Available (In Stock)</p>
                <div className="flex justify-center gap-2 text-sm mt-1">
                  <span className="text-orange-600 font-bold">
                    {product.price}
                  </span>
                  <span className="line-through text-gray-400">
                    {product.oldPrice}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </motion.section>
    </div>
  )
}
