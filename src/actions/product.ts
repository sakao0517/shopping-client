"use server";

export async function getProducts(category: string, currentPage: number) {
  const res = await fetch(
    `${process.env.SERVER_URL}/product/page/${category}?page=${currentPage}&length=${process.env.PAGE_PRODUCT_LIMIT}`,
    {
      cache: "no-store",
      next: {
        tags: ["products"],
      },
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

export async function getProduct(id: string) {
  const res = await fetch(`${process.env.SERVER_URL}/product/detail/${id}`, {
    cache: "no-store",
    next: { tags: ["product", id] },
  });
  if (!res.ok) {
    const errorMessage = await res.json();
    class CustomError extends Error {
      digest = errorMessage.message;
    }
    throw new CustomError();
  }
  const product = await res.json();
  return product;
}

export async function getProductBySearch(q: string | null) {
  if (!q) return [];
  const res = await fetch(`${process.env.SERVER_URL}/product/search?q=${q}`, {
    cache: "no-store",
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
