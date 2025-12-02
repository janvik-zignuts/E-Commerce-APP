import Header from '@/componnets/common/header';
import OrderConfirmation from './components/orderConfirmation';

export const metadata = {
  title: 'Order Confirmation - FashionHub',
  description: 'Review order confirmation details and stay updated on delivery status.',
};

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16 lg:pt-20">
        <OrderConfirmation />
      </main>
    </>
  );
}

