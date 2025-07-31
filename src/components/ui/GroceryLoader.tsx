import { motion } from 'framer-motion'

const GroceryLoader = () => {
  // Grocery items with their colors and initial positions
  const groceryItems = [
    { id: 1, color: 'bg-red-500', icon: '🍎', name: 'Apple', y: 0 },
    { id: 2, color: 'bg-yellow-400', icon: '🍌', name: 'Banana', y: 20 },
    { id: 3, color: 'bg-green-500', icon: '🥦', name: 'Broccoli', y: 40 },
    { id: 4, color: 'bg-orange-500', icon: '🥕', name: 'Carrot', y: 60 },
    { id: 5, color: 'bg-purple-500', icon: '🍆', name: 'Eggplant', y: 80 },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-8">
      <motion.div
        className="text-4xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        GrocerJet
      </motion.div>

      <div className="relative h-32 w-full max-w-md">
        {/* Shopping basket */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-amber-700 rounded-b-lg"></div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-44 h-2 bg-amber-800 rounded-full"></div>

        {/* Animated grocery items */}
        {groceryItems.map((item) => (
          <motion.div
            key={item.id}
            className={`absolute left-1/2 transform -translate-x-1/2 w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-xl shadow-md`}
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: [item.y - 100, item.y, item.y - 20, item.y],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2,
              delay: item.id * 0.2,
              ease: 'easeInOut',
              times: [0, 0.3, 0.7, 1],
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Loading text with animation */}
      <motion.div
        className="text-gray-600 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        >
          Loading 
        </motion.span>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: 0.3,
            ease: 'easeInOut',
          }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: 0.6,
            ease: 'easeInOut',
          }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: 0.9,
            ease: 'easeInOut',
          }}
        >
          .
        </motion.span>
      </motion.div>
    </div>
  )
}

export default GroceryLoader
 