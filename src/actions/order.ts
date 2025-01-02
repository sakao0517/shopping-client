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
    throw new Error(errorMessage.message);
  }
}

export async function verifyOrder(orderId: string, amount: number) {
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
    body: JSON.stringify({ orderId, amount }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    throw new Error(errorMessage.message);
  }
}

export async function confirmOrder(
  orderId: string,
  paymentKey: string,
  amount: string
) {
  const session = await auth();
  if (!session) return;
  const url = "https://api.tosspayments.com/v1/payments/confirm";
  const base64 = Buffer.from(`${process.env.TOSS_SECRET}:`, "utf8").toString(
    "base64"
  );
  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64}`,
      "Content-Type": "application/json",
    },
    body: `{"paymentKey":"${paymentKey}","amount":${amount},"orderId":"${orderId}"}`,
  };
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorMessage = await res.json();
    throw new Error(errorMessage.message);
  }
  const data = await res.json();
  return data;
}

export async function successOrder(orderId: string, paymentKey: string) {
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
    body: JSON.stringify({ orderId, paymentKey }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    throw new Error(errorMessage.message);
  }
  revalidateTag("account");
  revalidateTag("cart");
  revalidateTag("product");
}
