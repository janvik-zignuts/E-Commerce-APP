'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/componnets/ui/appIcon';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center space-y-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground">
        <Icon name="CheckCircleIcon" size={32} variant="solid" color="green" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-text-primary">Order confirmed</h1>
        <p className="text-text-secondary">
          Thanks for shopping with FashionHub. We&apos;ll notify you when your order status updates.
        </p>
        {orderId && (
          <p className="text-sm text-text-secondary">
            Order ID: <span className="font-semibold text-text-primary">{orderId}</span>
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 text-left space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">What happens next?</h2>
        <ul className="list-disc pl-5 text-sm text-text-secondary space-y-2">
          <li>Your order has been saved to your account in Firestore.</li>
          <li>We&apos;ll send realtime updates about delivery once processing begins.</li>
          <li>You can review this order anytime from your account dashboard.</li>
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/product-catalog"
          className="inline-flex items-center bg-blue-500 text-white justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition-smooth"
        >
          Continue shopping
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-md  bg-green-500 text-white px-6 py-3 font-medium hover:bg-muted transition-smooth"
        >
          View cart
        </Link>
      </div>
    </section>
  );
}

