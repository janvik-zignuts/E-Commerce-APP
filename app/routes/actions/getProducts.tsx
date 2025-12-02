"use server";

import { db } from "@/lib/firbase";
import { collection, getDocs } from "firebase/firestore";

export async function getProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}