import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', message: '' })

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Get in touch
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Email</h3>
                  <p className="text-gray-500">support@example.com</p>
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                  >
                    Send email <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Phone</h3>
                  <p className="text-gray-500">+1 (555) 123-4567</p>
                  <a
                    href="tel:+15551234567"
                    className="text-green-600 hover:text-green-800 text-sm flex items-center mt-1"
                  >
                    Call us <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-purple-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Address</h3>
                  <p className="text-gray-500">123 Business Ave</p>
                  <p className="text-gray-500">
                    Suite 400, San Francisco, CA 94107
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10"
            >
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Follow us
              </h3>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map(
                  (social, index) => (
                    <motion.a
                      key={social}
                      href="#"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <span className="sr-only">{social}</span>
                      <div className="h-5 w-5 bg-gray-400 rounded-full" />
                    </motion.a>
                  ),
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium ${
                    isSubmitting
                      ? 'bg-blue-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition`}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Success Message */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Your message has been sent successfully!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactUs
