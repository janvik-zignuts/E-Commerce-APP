"use server";

import { doc, setDoc } from "firebase/firestore";
import products from "../data/mockdata.json"; 
import { db } from "@/lib/firbase";

export async function importProducts() {
  for (const product of products) {
    await setDoc(doc(db, "products", product.id), product);
  }
  return "Imported " + products.length + " products";
}