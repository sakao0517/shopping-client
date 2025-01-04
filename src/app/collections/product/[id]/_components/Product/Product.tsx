"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Product.module.css";
import { ProductType } from "@/type/type";
import { getProduct } from "@/actions/product";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { addToCart } from "@/actions/auth";
import { useCartIsChangeStore } from "@/store/store";
import LoadingWithoutPadding from "@/app/_components/LoadingWithoutPadding/LoadingWithoutPadding";

export default function Product({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [selectSize, setSelectSize] = useState<string>("");
  const { setCartIsChange } = useCartIsChangeStore();
  const { data: product, isLoading } = useQuery<ProductType>({
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
      setCartIsChange(true);
    },
    onError: (error: any) => {
      if (error.digest === "sold out") {
        setMessage("현재 품절된 상품입니다.");
      } else if (error.digest === "product is already in cart") {
        setMessage("상품이 이미 장바구니에 담겨있습니다.");
      } else {
        setMessage("문제가 발생했습니다. 다시 시도하세요.");
      }
    },
  });
  const handleAddToCart = () => {
    if (selectSize === "") {
      return setMessage("사이즈를 선택해주세요.");
    }
    if (!session?.user?.email) {
      return setMessage("로그인이 필요합니다.");
    }
    addToCartMutate.mutate();
  };

  if (isLoading) return <LoadingWithoutPadding />;
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
          <div className={styles.buttonDiv}>
            <button onClick={handleAddToCart} className={styles.button}>
              ADD TO CART
            </button>
            {message && <span className={styles.message}>{message}</span>}
          </div>
        )}
        <div className={styles.description}>
          <span>{product?.description}</span>
        </div>
      </div>
    </div>
  );
}
