'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useCart } from '@/hooks/useCart';
import Icon from '@/componnets/ui/appIcon';
import AppImage from '@/componnets/ui/appImage';

type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

const  CartInteractive=()=> {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthUser();
  const {
    items,
    loading: cartLoading,
    error,
    totals,
    updateItemQuantity,
    removeItem,
    checkout,
  } = useCart({ userId: user?.uid });


  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const isLoadingState = authLoading || cartLoading;

  const formattedTotals = useMemo(() => {
    const subtotal = totals.subtotal ?? 0;
    const estimatedTax = subtotal * 0.08;
    const total = subtotal + estimatedTax;
    return {
      subtotal: subtotal.toFixed(2),
      tax: estimatedTax.toFixed(2),
      total: total.toFixed(2),
      items: totals.totalItems,
    };
  }, [totals]);

  const handleQuantityChange = async (productId: string, nextQuantity: number) => {
    try {
      await updateItemQuantity(productId, nextQuantity);
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Unable to update item. Please try again.');
    }
  };

  const handleCheckout = async () => {
    if (!items.length) {
      setStatus('error');
      setMessage('Your cart is empty.');
      return;
    }

    try {
      setStatus('processing');
      setMessage(null);
      const orderId = await checkout();
      const destination = orderId ? `/orders?orderId=${orderId}` : '/orders';
      router.push(destination);
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Checkout failed. Please try again.');
      return;
    }
    setStatus('idle');
  };

  if (isLoadingState) {
    return (
      <section className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3 text-text-secondary">
          <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
          <span>Loading your cart...</span>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-10 text-center space-y-6">
          <Icon name="LockClosedIcon" size={40} variant="outline" className="mx-auto text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Sign in to view your cart</h1>
            <p className="text-text-secondary mt-2">
              Your cart is securely saved to your account. Sign in to access your saved items and checkout.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition-smooth"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Your Cart</h1>
        <p className="text-text-secondary">
          Manage the items in your cart. Updates are saved instantly to your account.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`mb-6 rounded-md border p-4 text-sm ${
            status === 'error' || error
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {message || error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {items.length === 0 && status !== "processing" ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-4">
              <Icon name="ShoppingCartIcon" size={48} variant="outline" className="mx-auto text-muted-foreground" color='red' />
              <div className="space-y-2">
                <p className="text-xl font-semibold text-red-500">Your cart is empty!!</p>
                <p className="text-gray-500">
                  Browse the catalog and add items to your cart. They will appear here instantly.
                </p>
              </div>
              <Link
                href="/routes/product-catalog"
                className="inline-flex bg-blue-500 text-white items-center justify-center rounded-md border border-border px-5 py-2 font-medium hover:bg-muted transition-smooth"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
       items.map(item => {
              const price = item.salePrice ?? item.price;
              const lineTotal = (price * item.quantity).toFixed(2);
              const disableDecrement = item.quantity <= 1;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <AppImage
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-semibold text-text-primary">{item.name}</p>
                      <p className="text-sm text-text-secondary">{item.brand}</p>
                      <p className="text-sm text-text-secondary">Size: {item.sizes?.[0] ?? 'One Size'}</p>
                      <p className="text-base font-medium text-text-primary">${price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        className="px-3 py-2 text-lg disabled:opacity-40"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        disabled={disableDecrement}
                      >
                        −
                      </button>
                      <span className="px-4 text-base font-semibold">{item.quantity}</span>
                      <button
                        className="px-3 py-2 text-lg"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-text-secondary">Line total</p>
                      <p className="text-xl font-semibold text-text-primary">${lineTotal}</p>
                    </div>

                    <button
                      className="text-sm text-error hover:underline cursor-pointer bg-red-500 text-white px-3 py-1 rounded-md transition-smooth"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

    {(items.length > 0 || status === "processing") &&    <aside className="rounded-xl border border-border bg-card p-6 h-fit space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Order Summary</h2>
            <p className="text-sm text-text-secondary">Review your cart before checkout.</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Items ({formattedTotals.items})</span>
              <span>${formattedTotals.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated tax</span>
              <span>${formattedTotals.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${formattedTotals.total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={status === 'processing' || items.length === 0}
            className=" bg-blue-600 text-white cursor-pointer rounded-md bg-primary p-2 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center m-auto mb-3 justify-center gap-2"
          >
            {status === 'processing' ? (
              <>
                <div className="w-4 h-4  border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon name="CreditCardIcon" size={20} variant="outline" />
                Checkout Order
              </>
            )}
          </button>

       
        </aside>}
      </div>
    </section>
  );
}

export default CartInteractive;