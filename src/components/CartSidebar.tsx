import { useCart } from "@/store/cartStore"

const CartSidebar = ({ onClose }: { onClose?: () => void }) => {
  const { state, dispatch } = useCart()

  const total = state.items.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0,
  )

  const handleCancelOrder = () => {
    // Remove all items from cart
    state.items.forEach((item: any) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })
    })
    if (onClose) onClose()
  }

  const handleCheckout = () => {
    // Placeholder for checkout logic
    alert('Proceeding to checkout...')
    if (onClose) onClose()
  }

  return (
    <div className="fixed top-16 right-4 w-96 bg-white shadow-lg rounded-lg p-4 z-40">
      <h2 className="text-lg font-bold mb-4">My Cart</h2>
      {state.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {state.items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 ml-2">
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-sm text-gray-600">
                  Ksh {item.product_price} × {item.quantity}
                </p>
              </div>
              <button
                className="text-red-500 text-xs ml-2"
                onClick={() =>
                  dispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: item.id,
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-red-600">
              Ksh {total.toFixed(2)}
            </span>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
      {onClose && (
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  )
}
export default CartSidebar