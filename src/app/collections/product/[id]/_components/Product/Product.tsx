"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Product.module.css";
import { ProductType } from "@/type/type";
import { getProduct } from "@/actions/product";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { addToCart } from "@/actions/auth";

export default function Product({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [selectSize, setSelectSize] = useState<string>("");
  const { data: product } = useQuery<ProductType>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });
  const addToCartMutate = useMutation({
    mutationFn: async () => {
      await addToCart(id, selectSize);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
    onError: (error: any) => {
      if (error.digest === "sold out") {
        alert("현재 품절된 상품입니다.");
      } else if (error.digest === "product is already in cart") {
        alert("상품이 이미 장바구니에 담겨있습니다.");
      } else {
        alert("문제가 발생했습니다. 다시 시도하세요.");
      }
    },
  });
  const handleAddToCart = () => {
    if (selectSize === "") {
      return alert("사이즈를 선택해주세요.");
    }
    if (!session?.user?.email) {
      return alert("로그인이 필요합니다.");
    }
    addToCartMutate.mutate();
  };
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        {product?.img.map((image, index) => (
          <div className={styles.image} key={index}>
            <img src={image} />
          </div>
        ))}
      </div>
      <div className={styles.right}>
        <div className={styles.top}>
          <span>{product?.name}</span>
          <span>{product ? `₩${product?.price}` : ""}</span>
        </div>
        <div className={styles.size}>
          {product?.stock.map((stock, index) => {
            return (
              <span
                className={
                  stock.qty <= 0 ? `${styles.soldOut}` : styles.sizeSpan
                }
                key={index}
                onClick={() => {
                  if (stock.qty === 0) return;
                  setSelectSize(stock.size);
                }}
              >
                {stock.size}
                {selectSize === stock.size && (
                  <span className={styles.selectSize}></span>
                )}
              </span>
            );
          })}
        </div>
        {product && (
          <button onClick={handleAddToCart} className={styles.button}>
            ADD TO CART
          </button>
        )}
        <div className={styles.description}>
          <span>{product?.description}</span>
        </div>
      </div>
    </div>
  );
}
