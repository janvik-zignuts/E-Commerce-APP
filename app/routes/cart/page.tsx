import Header from '@/componnets/common/header';
import CartInteractive from './components/cartInteractive';

export const metadata = {
  title: 'Your Cart - FashionHub',
  description: 'Manage your shopping cart with real-time updates synced to your account.',
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16 lg:pt-20">
        <CartInteractive />
      </main>
    </>
  );
}

