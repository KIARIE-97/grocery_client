// components/InvoicePDF.tsx
import type { TOrder } from '@/types/order.types'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'

// Create styles with watermark support
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    position: 'relative', // Needed for absolute positioning of watermark
  },
  watermark: {
    position: 'absolute',
    opacity: 0.1,
    transform: 'rotate(-45deg)',
    fontSize: 120,
    color: '#f97316',
    left: 150,
    top: 300,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f97316',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#374151',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  companyLogo: {
    width: 100,
    height: 40,
    marginBottom: 10,
  },
})

interface InvoicePDFProps {
  order: TOrder
  companyName: string
}

const InvoicePDF = ({ order, companyName }: InvoicePDFProps) => {
  const deliveryTime = order.delivery_schedule_at
    ? new Date(order.delivery_schedule_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'

  const createdTime = order.created_at
    ? new Date(order.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'

    const TotalAmount = order?.tax_amount + order?.total_amount + order?.delivery_fee || 20

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.watermark} fixed>
          <Text>{companyName}</Text>
        </View>

        {/* Header with logo placeholder */}
        <View style={styles.header}>
          {/* Replace with your actual logo if you have one */}
          <View style={styles.companyLogo}>
            <Text style={styles.title}>Grocer Jet</Text>
          </View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>Order #{order.order_id}</Text>
        </View>

        {/* Rest of your invoice content remains the same as before */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Time:</Text>
            <Text style={styles.value}>
              Today, {createdTime} - {deliveryTime}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{order.payment_method || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{order.status}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{order.customer?.full_name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{order.customer?.email || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>
              {order.customer?.phone_number || 'N/A'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>
              {order.delivery_address?.addressLine1 || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={{ ...styles.row, marginBottom: 10 }}>
            <Text style={{ ...styles.label, fontWeight: 'bold' }}>Item</Text>
            <Text style={{ ...styles.label, fontWeight: 'bold' }}>Amount</Text>
          </View>
          {order.products?.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.label}>
                {item.quantity} x {item.product_price.toFixed(2)} -{' '}
              </Text>
              <Text style={styles.value}>
                KES{(item.product_price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={{ ...styles.row, marginTop: 10 }}>
            <Text style={{ ...styles.label, fontWeight: 'bold' }}>Total:</Text>
            <Text style={{ ...styles.value, color: '#f97316' }}>
              KES {TotalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your order!</Text>
          <Text>For any questions, please contact our customer support</Text>
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePDF
