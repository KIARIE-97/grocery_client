import WalletPage from '@/components/customer/Wallet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/mywallet')({
  component: WalletPage,
})


