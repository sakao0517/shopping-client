"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function getCategory() {
  const res = await fetch(`${process.env.SERVER_URL}/category`, {
    cache: "no-store",
    next: {
      tags: ["category"],
    },
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const category = await res.json();
  return category;
}

export async function updateCategory(id: string, newCategory: string[]) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/category`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({ id, newCategory }),
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
