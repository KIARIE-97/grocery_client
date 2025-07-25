
function Footer() {
  return (
    <>
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

export default Footer