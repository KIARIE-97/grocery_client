import { Card, CardContent } from '@/components/ui/card'
import { Wallet, BadgePercent } from 'lucide-react'

export default function WalletPage() {


  const offers = [
    { offer: '15%', code: 'GJCOUP15', expires: '31 May 2020' },
    { offer: '10%', code: 'GJCOUP10', expires: '25 May 2020' },
    { offer: '25%', code: 'GJCOUP25', expires: '20 May 2020' },
    { offer: '5%', code: 'GJCOUP05', expires: '15 May 2020' },
  ]

  const history = [
    { id: 'ORD14255896', amount: '-KES 25', date: '6 May 2018, 12.56PM' },
    { id: 'ORD14255895', amount: '-KES 21', date: '5 May 2018, 11.16AM' },
    { id: 'ORD14255894', amount: '-KES 30', date: '4 May 2018, 02.56PM' },
  ]

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">My Wallet</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Wallet className="w-10 h-10 mb-2 text-green-500" />
            <h3 className="text-lg font-semibold">My Balance</h3>
            <p className="text-2xl font-bold">KES 120</p>
            <p className="text-sm text-gray-500">Added: 8 May 2020</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BadgePercent className="w-10 h-10 mb-2 text-yellow-500" />
            <h3 className="text-lg font-semibold">Gambo Cashback Balance</h3>
            <p className="text-2xl font-bold">KES 5</p>
            <p className="text-sm text-gray-500">
              100% of this can be used for your next order.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Active Offers</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Offers</th>
                  <th className="text-left p-2">Offer Code</th>
                  <th className="text-left p-2">Expires Date</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{offer.offer}</td>
                    <td className="p-2 font-medium">{offer.code}</td>
                    <td className="p-2">{offer.expires}</td>
                    <td className="p-2 text-orange-500 font-semibold">
                      Activated
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add Balance Form */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add Balance</h3>
            {/* <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Holder Name"
                  {...form.register('holder')}
                  className="border p-2 rounded w-full"
                />
                <input
                  placeholder="Card Number"
                  {...form.register('card')}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  {...form.register('expMonth')}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Year"
                  {...form.register('expYear')}
                  className="border p-2 rounded w-full"
                />
                <input
                  placeholder="CVV"
                  {...form.register('cvv')}
                  className="border p-2 rounded w-full"
                />
              </div>
              <input
                placeholder="Add Balance"
                {...form.register('amount')}
                className="border p-2 rounded w-full"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
              >
                Add Balance
              </button>
            </form> */}
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">History</h3>
            <div className="space-y-4">
              {history.map((tx, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">Purchase</p>
                    <p className="text-sm">
                      Transaction ID{' '}
                      <span className="text-orange-500">{tx.id}</span>
                    </p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-semibold">{tx.amount}</p>
                    <button className="text-blue-500 text-sm hover:underline">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
