"use server";

import { db } from "@/lib/firbase";
import { doc, setDoc } from "firebase/firestore";

export async function updateUserInFirestore(uid: string, name: string) {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        displayName: name,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Firestore error:", error);
    return { success: false, message: "Firestore update failed" };
  }
}