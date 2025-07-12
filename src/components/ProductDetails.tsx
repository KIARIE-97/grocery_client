import { useSingleProduct } from "@/hooks/UseProduct"
import { useCart } from "@/store/cartStore";
import type { TProduct } from "@/types/product.types";

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
    
    console.log('Added to cart:', product.product_name)
  }
  return (
    <button
      onClick={handleAddToCart}
      className="bg-orange-500 text-white px-4 py-2 rounded"
    >
      Add to Cart
    </button>
  )
}

const ProductDetails: React.FC<{ productId: string }> = ({ productId }) => {
    console.log('productId:', productId)
  const { data: product, isLoading, error } = useSingleProduct(productId)
  const placeholderImage =
    'https://gardenfishcorner.pk/wp-content/uploads/2021/02/king-fish-2-768x979.jpg'

    console.log('isLoading:', isLoading, 'error:', error, 'product:', product)

    if (isLoading)
        return <div className="p-4 text-center">Loading product details...</div>
    if (error || !product)
        return (
    <div className="p-4 text-center text-red-500">
        Failed to load product.
      </div>
    )
    console.log('Product Details:', product)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden md:flex">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.product_image ?? placeholderImage}
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">{product.product_name}</h2>
          <p className="text-gray-700 mb-2">{product.product_description}</p>
          <p className="text-xl text-red-600 font-semibold mb-4">
            Ksh {product.product_price}
          </p>

          <div className="flex gap-4 mb-6">
            <AddToCartButton
              product={{
                ...product,
                // Remove 'id' if it does not exist on SProduct
                quantity: product.quantity ?? 1,
                store: Number(product.store?.id) ?? 0,
              }}
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Buy Now
            </button>
          </div>

          <ul className="text-sm text-gray-600 space-y-1 mb-6">
            <li>
              <strong>Quantity:</strong> {product.quantity}
            </li>
            <li>
              <strong>Stock:</strong> {product.stock}
            </li>
            <li>
              <strong>Available:</strong> {product.is_available ? 'Yes' : 'No'}
            </li>
          </ul>

          <div className="border-t pt-4">
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
          </div>
        </div>
      </div>

      {/* More Products Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">More Like This</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white shadow rounded-lg p-4">
              <img
                src={`https://static.vecteezy.com/system/resources/previews/012/876/409/non_2x/raw-chicken-on-wooden-board-and-wooden-background-free-photo.jpg`}
                alt={`Similar Product ${i}`}
                className="w-60 h-60 object-cover mb-3"
              />
              <h4 className="font-semibold text-lg mb-1">turkey {i}</h4>
              <span className="text-red-600 font-bold">
                Ksh {Math.floor(Math.random() * 200) + 50}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
