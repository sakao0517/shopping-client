"use server";

import { auth } from "@/auth";
import { Cart, OrderType } from "@/type/type";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.SERVER_URL}/auth/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    return null;
  }

  const user = await res.json();
  if (!user) {
    return null;
  }

  const token = res.headers.get("token");
  if (!token) {
    return null;
  }
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    maxAge: 7200,
    sameSite: "none",
    secure: true,
  });
  return user;
}

export async function me() {
  const cookie = await cookies();
  const ogToken = cookie.get("token");
  if (!ogToken) return null;
  const res = await fetch(`${process.env.SERVER_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${ogToken?.value}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const me = await res.json();
  if (!me) {
    return null;
  }

  const token = res.headers.get("token");
  if (!token) {
    return null;
  }
  cookie.set("token", token, {
    httpOnly: true,
    maxAge: 7200,
    sameSite: "none",
    secure: true,
  });
  return me;
}

export async function signup(
  name: string,
  email: string,
  password: string,
  phone: string
) {
  const res = await fetch(`${process.env.SERVER_URL}/auth/signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}

export async function serverLogout() {
  const cookie = await cookies();
  cookie.set("token", "", {});
}

export async function deleteUser() {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/delete`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}

//------------------------------//

export async function getUserInfo() {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/info`, {
    headers: { Authorization: `Bearer ${token?.value}` },
    cache: "no-store",
    next: {
      tags: ["account"],
    },
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const userInfo = await res.json();
  return userInfo;
}

export async function updateProfile(
  name: string,
  phone: string,
  address1: string,
  address2: string,
  zipcode: string,
  password: string | null,
  newPassword: string | null
) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/updateProfile`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      name,
      phone,
      address1,
      address2,
      zipcode,
      password,
      newPassword,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  revalidateTag("account");
}

export async function getUserOrder(orderId: string | undefined) {
  if (!orderId) return;
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/info`, {
    headers: { Authorization: `Bearer ${token?.value}` },
    cache: "no-store",
    next: {
      tags: ["account"],
    },
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const userInfo = await res.json();
  const order = userInfo.orders.find(
    (order: OrderType) => order.orderId === orderId
  );
  return order;
}

//------------------------------//

export async function addToCart(productId: string, size: string) {
  const session = await auth();
  if (!session) return;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/addToCart`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ productId, size }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  revalidateTag("products");
  revalidateTag(productId);
}

export async function getCartProduct() {
  const session = await auth();
  if (!session) return [];
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/getCartProducts`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    cache: "no-store",
    next: { tags: ["cart"] },
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const products = await res.json();
  return products;
}

export async function updateCart(cartStock: Cart, qty: number) {
  const session = await auth();
  if (!session) return;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/updateCart`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({ cartStock, qty }),
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
}

export async function deleteCart(cartStock: Cart) {
  const session = await auth();
  if (!session) return;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/auth/deleteCart`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({ cartStock }),
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
}

//------------------------------//

export async function forgotPassword(email: string) {
  const res = await fetch(`${process.env.SERVER_URL}/auth/forgotPassword`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}

export async function resetPassword(password: string, token: string) {
  const res = await fetch(`${process.env.SERVER_URL}/auth/resetPassword`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ password, token }),
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}
