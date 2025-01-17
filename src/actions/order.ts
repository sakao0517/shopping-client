"use server";

import { auth } from "@/auth";
import { CartProductType } from "@/type/type";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function tmpOrder(order: {
  userId: string;
  orderId: string;
  shipping: number;
  subtotal: number;
  amount: number;
  orderName: string;
  email: string;
  name: string;
  phone: string;
  address1: string;
  address2: string;
  zipcode: string;
  cart: CartProductType[];
}) {
  const session = await auth();
  if (!session) return;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/order/tmpOrder`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}

export async function verifyOrder(orderId: string) {
  const session = await auth();
  if (!session) return;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/order/verifyOrder`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}

export async function successOrder(orderId: string) {
  const session = await auth();
  if (!session) return;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/order/successOrder`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  revalidateTag("account");
  revalidateTag("cart");
  revalidateTag("product");
}
