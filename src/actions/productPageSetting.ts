"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function getProductPageSetting() {
  const res = await fetch(`${process.env.SERVER_URL}/productPageSetting`, {
    cache: "no-store",
    next: {
      tags: ["productPageSetting"],
    },
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const productPageSetting = await res.json();
  return productPageSetting;
}

export async function updateProductPageSetting(
  id: string,
  productMaxLength: number
) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/productPageSetting`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({ id, productMaxLength }),
    cache: "no-store",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}
