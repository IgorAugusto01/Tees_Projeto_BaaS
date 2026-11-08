import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../config";

export async function registerUser(
  email: string,
  password: string
): Promise<void> {
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}