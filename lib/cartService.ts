import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firbase';
import type { CartItem, Product } from '@/types/product';

const cartCollection = (userId: string) => collection(db, 'users', userId, 'cart');
const cartDoc = (userId: string, productId: string) =>
  doc(db, 'users', userId, 'cart', productId);
const ordersCollection = (userId: string) => collection(db, 'users', userId, 'orders');

export const cartService = {
  subscribe,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  checkout,
};

function subscribe(
  userId: string,
  onItems: (items: CartItem[]) => void,
  onError?: (error: Error) => void,
) {
  if (!userId) {
    throw new Error('Cannot subscribe to cart without a user id');
  }

  return onSnapshot(
    cartCollection(userId),
    snapshot => {
      const items: CartItem[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data() as CartItem;
        const price = typeof data.price === 'number' ? data.price : 0;
        const salePrice =
          typeof data.salePrice === 'number' ? data.salePrice : undefined;

        return {
          ...data,
          id: data.id ?? docSnap.id,
          price,
          salePrice,
          quantity: data.quantity ?? 1,
        };
      });
      onItems(items);
    },
    error => {
      onError?.(error);
    },
  );
}

async function addItem(userId: string, product: Product, quantity = 1) {
  if (!userId) {
    throw new Error('User must be signed in to add items to cart');
  }

  await runTransaction(db, async transaction => {
    const itemRef = cartDoc(userId, product.id);
    const snapshot = await transaction.get(itemRef);

    if (!snapshot.exists()) {
      transaction.set(itemRef, {
        ...product,
        quantity,
        addedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const currentQuantity = (snapshot.data()?.quantity as number | undefined) ?? 0;
    transaction.update(itemRef, {
      quantity: currentQuantity + quantity,
      updatedAt: serverTimestamp(),
    });
  });
}

async function updateItemQuantity(userId: string, productId: string, quantity: number) {
  if (!userId) {
    throw new Error('User must be signed in to update cart items');
  }

  if (quantity <= 0) {
    await removeItem(userId, productId);
    return;
  }

  await runTransaction(db, async transaction => {
    const itemRef = cartDoc(userId, productId);
    const snapshot = await transaction.get(itemRef);

    if (!snapshot.exists()) {
      throw new Error('Cart item does not exist');
    }

    transaction.update(itemRef, {
      quantity,
      updatedAt: serverTimestamp(),
    });
  });
}

async function removeItem(userId: string, productId: string) {
  if (!userId) {
    throw new Error('User must be signed in to remove cart items');
  }

  await deleteDoc(cartDoc(userId, productId));
}

async function clearCart(userId: string) {
  if (!userId) {
    throw new Error('User must be signed in to clear cart');
  }

  const snapshot = await getDocs(cartCollection(userId));
  const batch = writeBatch(db);
  snapshot.forEach(docSnap => batch.delete(docSnap.ref));
  await batch.commit();
}

async function checkout(userId: string, items: CartItem[]) {
  if (!userId) {
    throw new Error('User must be signed in to checkout');
  }

  if (!items.length) {
    throw new Error('Cart is empty');
  }

  const DEFAULT_TAX_RATE = 0.08;
  const lineItems = items.map(item => {
    const price = item.salePrice ?? item.price;
    return {
      productId: item.id,
      name: item.name,
      brand: item.brand,
      price,
      quantity: item.quantity,
      image: item.image,
      subtotal: Number((price * item.quantity).toFixed(2)),
    };
  });

  const totals = lineItems.reduce(
    (acc, item) => {
      acc.quantity += item.quantity;
      acc.subtotal += item.price * item.quantity;
      return acc;
    },
    { quantity: 0, subtotal: 0 },
  );

  const subtotal = Number(totals.subtotal.toFixed(2));
  const tax = Number((subtotal * DEFAULT_TAX_RATE).toFixed(2));
  const grandTotal = Number((subtotal + tax).toFixed(2));

  const orderDoc = await addDoc(ordersCollection(userId), {
    userId,
    lineItems,
    totalQuantity: totals.quantity,
    subtotal,
    tax,
    grandTotal,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await clearCart(userId);

  return orderDoc.id;
}

