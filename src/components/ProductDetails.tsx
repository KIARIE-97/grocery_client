import { useSingleProduct } from '@/hooks/UseProduct'
import { useCart } from '@/store/cartStore'
import type { TProduct } from '@/types/product.types'
import { motion } from 'framer-motion'
import { useProduct } from '@/hooks/UseProduct'
import { useParams } from '@tanstack/react-router'
import GroceryLoader from './ui/GroceryLoader'

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

const AddToCartButton = ({ product }: { product: any }) => {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity: 1,
      },
    })
  }

  return (
    <motion.button
      onClick={handleAddToCart}
      className="bg-orange-500 text-white px-4 py-2 rounded"
      whileHover={hoverEffect}
      whileTap={tapEffect}
    >
      Add to Cart
    </motion.button>
  )
}

const ProductDetails: React.FC<{ productId: string; onBack?: () => void }> = ({
  productId,
  onBack,
}) => {
  console.log('productId passed to useSingleProduct:', productId)
  const { data: product, isLoading, error } = useSingleProduct(productId)
  const { categoryId } = useParams({ from: '/product/$categoryId' })
  console.log('productId', productId)
  console.log('product', product)
  console.log('error', error)

  // Fetch related products from the same category
  const { data: relatedProducts } = useProduct() as {
    data: TProduct[]
  }
  // Filter out the current product from related products
  const filteredRelatedProducts =
  relatedProducts?.filter((p) => p.id.toString() !== productId).slice(0, 3) ||
  []
  console.log('relatedProducts', filteredRelatedProducts)

  const placeholderImage =
    'https://gardenfishcorner.pk/wp-content/uploads/2021/02/king-fish-2-768x979.jpg'

  if (isLoading)
    return (
      <motion.div
        className="p-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
      <GroceryLoader />
      </motion.div>
    )

  if (error || !product)
    return (
  <motion.div
  className="p-4 text-center text-red-500"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  >
        Failed to load product.
      </motion.div>
    )

  return (
    <motion.div
      className="max-w-6xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {onBack && (
        <motion.button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-orange-500"
          whileHover={{ x: -5 }}
          whileTap={tapEffect}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to products
        </motion.button>
      )}

      <motion.div
        className="bg-white shadow-md rounded-lg overflow-hidden md:flex"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Product Image */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.img
            src={product.product_image ?? placeholderImage}
            alt={product.product_name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          className="md:w-1/2 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-4"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
          >
            {product.product_name}
          </motion.h2>

          <motion.p
            className="text-gray-700 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {product.product_description}
          </motion.p>

          <motion.p
            className="text-xl text-red-600 font-semibold mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Ksh {product.product_price}
          </motion.p>

          <motion.div
            className="flex gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <AddToCartButton
              product={{
                ...product,
                quantity: product.quantity ?? 1,
                store: Number(product.store?.id) ?? 0,
              }}
            />
            <motion.button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              whileHover={hoverEffect}
              whileTap={tapEffect}
            >
              Buy Now
            </motion.button>
          </motion.div>

          <motion.ul
            className="text-sm text-gray-600 space-y-1 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
        
            <li>
              <strong>Stock:</strong> {product.stock}
            </li>
            <li>
              <strong>Available:</strong> {product.is_available ? 'Yes' : 'No'}
            </li>
          </motion.ul>

          <motion.div
            className="border-t pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="font-semibold text-lg mb-2">Store Info</h3>
            <p>
              <strong>Name:</strong> {product.store.store_name}
            </p>
            <p>
              <strong>Location:</strong> {product.store.location}
            </p>
            <p>
              <strong>Verified:</strong>{' '}
              {product.store.is_verified ? 'Yes' : 'No'}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* More Products Section */}
      {filteredRelatedProducts.length > 0 && (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.h3
            className="text-xl font-semibold mb-6"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
          >
            More Like This
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredRelatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                variants={itemVariants}
                whileHover={hoverEffect}
                whileTap={tapEffect}
                className="bg-white shadow rounded-lg p-4 cursor-pointer"
                onClick={() => {
                  // You might want to handle navigation differently
                  window.location.href = `/product/${categoryId}/${relatedProduct.id}`
                }}
              >
                <motion.img
                  src={relatedProduct.product_image ?? placeholderImage}
                  alt={relatedProduct.product_name}
                  className="w-full h-60 object-cover mb-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                />
                <h4 className="font-semibold text-lg mb-1">
                  {relatedProduct.product_name}
                </h4>
                <span className="text-red-600 font-bold">
                  Ksh {relatedProduct.product_price}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ProductDetails
