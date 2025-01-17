"use server";

import { auth } from "@/auth";
import { Stock } from "@/type/type";
import { cookies } from "next/headers";

export async function getAdminProducts(category: string, options: string) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(
    `${process.env.SERVER_URL}/admin/product/${category}${options}`,
    {
      headers: { Authorization: `Bearer ${token?.value}` },
      cache: "no-store",
    }
  );
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

export async function addAdminProduct(
  name: string,
  price: number,
  category: string,
  img: string[],
  stock: Stock[],
  description: string,
  createdAt: string,
  isNew: boolean,
  isVisible: boolean
) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/product`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name,
      price,
      category,
      img,
      stock,
      description,
      createdAt,
      isNew,
      isVisible,
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
}

export async function updateDateAdminProduct(productId: string) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(
    `${process.env.SERVER_URL}/admin/product/updateDate`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ productId }),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}

export async function updateAdminProduct(
  productId: string,
  name: string,
  price: number,
  category: string,
  img: string[],
  stock: Stock[],
  description: string,
  isNew: boolean,
  isVisible: boolean
) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/product/update`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      productId,
      name,
      price,
      category,
      img,
      stock,
      description,
      isNew,
      isVisible,
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
}

export async function deleteAdminProduct(productId: string) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(
    `${process.env.SERVER_URL}/admin/product/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      method: "DELETE",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
}

//------------------------------//

export async function getAdminUser(options: string) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/auth/${options}`, {
    headers: { Authorization: `Bearer ${token?.value}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const users = await res.json();
  return users;
}

export async function updateAdminUser(
  userId: string,
  name: string,
  isAdmin: boolean,
  phone: string,
  address1: string,
  address2: string,
  zipcode: string,
  newPassword: string | null
) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/auth/update`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      userId,
      name,
      isAdmin,
      phone,
      address1,
      address2,
      zipcode,
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
}

export async function updateAdminUserOrder(order: {
  name: string;
  phone: string;
  address1: string;
  address2: string;
  zipcode: string;
  orderId: string;
  orderStatus: string;
  trackingNumber: string;
}) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/auth/order/update`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(order),
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

export async function deleteAdminUser(userId: string) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/auth/${userId}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    method: "DELETE",
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

//------------------------------//
export async function getAdminAllOrder() {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/allOrder`, {
    headers: { Authorization: `Bearer ${token?.value}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const orders = await res.json();
  return orders;
}

export async function getAdminOrder(options: string) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/order/${options}`, {
    headers: { Authorization: `Bearer ${token?.value}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const orders = await res.json();
  return orders;
}

export async function deleteAdminOrder(orderId: string) {
  const session = await auth();
  if (!session) return null;
  const cookie = await cookies();
  const token = cookie.get("token");
  const res = await fetch(`${process.env.SERVER_URL}/admin/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    method: "DELETE",
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

export async function cancelOrder(
  orderId: string,
  cancelAmount: number,
  cancelReason: string
) {
  const session = await auth();
  if (!session) return;
  const cookie = await cookies();
  const token = cookie.get("token");

  const res = await fetch(`${process.env.SERVER_URL}/admin/order/cancel`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({ orderId, cancelReason, cancelAmount }),
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
