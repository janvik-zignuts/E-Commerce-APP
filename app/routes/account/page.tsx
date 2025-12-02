import Header from '@/componnets/common/header';
import AccountProfile from './components/accountProfile';

export const metadata = {
  title: 'Your Account - FashionHub',
  description: 'View your FashionHub profile information and account activity.',
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16 lg:pt-20">
        <AccountProfile />
      </main>
    </>
  );
}

