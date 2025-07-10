import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

interface Order {
  order_id: string
  delivery_schedule_at: string
  payment_method: string
  payment_status: string
  status: string
  total_amount: number
}

interface CustomerPDFProps {
  full_name: string
  email: string
  orders: Order[]
  logoUrl?: string
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Courier' },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: { marginBottom: 12 },
  divider: { borderTop: '1pt solid #aaa', marginVertical: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  orderBlock: { marginBottom: 8 },
})

export const OrderPDF: React.FC<CustomerPDFProps> = ({ full_name, email, orders }) => (
  <Document>
    <Page style={styles.page}>
      <Image
        src="/grocery-texture.png" // Use a light, low-opacity image
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.07,
          zIndex: -1,
        }}
      />
      <View style={styles.section}>
        <Text style={styles.heading}>🧺 Grocerjet Grocery Receipt</Text>
        <Text>Customer: {full_name}</Text>
        <Text>Email: {email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Customer: {full_name}</Text>
        <Text>Email: {email}</Text>
        <Text>Orders:</Text>
      </View>

      {orders.map((order, i) => (
        <View key={i} style={styles.orderBlock}>
          <Text>Order ID: {order.order_id}</Text>
          <Text>Status: {order.status}</Text>
          <Text>
            Payment: {order.payment_method} ({order.payment_status})
          </Text>
          <Text>Delivery: {order.delivery_schedule_at}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>Total Amount</Text>
            <Text>${order.total_amount.toFixed(2)}</Text>
          </View>
          <Text>— Cashback will be credited in 12 hours —</Text>
        </View>
      ))}
      <Text style={{ marginTop: 12, textAlign: 'center' }}>
        Generated on: {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
)
