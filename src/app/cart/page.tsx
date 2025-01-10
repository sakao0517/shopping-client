"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./page.module.css";
import { getCartProduct } from "@/actions/auth";
import { CartProductType } from "@/type/type";
import { useEffect, useState } from "react";
import EmptyCart from "./_components/EmptyCart/EmptyCart";
import { useRouter } from "next/navigation";
import CartCard from "./_components/CartCard/CartCard";
import { BsQuestionCircle } from "react-icons/bs";
import { mainColor } from "@/app/_config/ColorSetting";
import Loading from "../_components/Loading/Loading";

export default function Cart() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCartProduct(),
  });
  const [subtotal, setSubTotal] = useState<number | null>(null);
  const [shipping, setShipping] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [shippingTip, setShippingTip] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (!products) return;
    let cal: number = 0;
    products.forEach((product: CartProductType) => {
      cal += Number(product.price) * Number(product.cartStock.stock.qty);
    });
    setSubTotal(cal);
  }, [products]);
  useEffect(() => {
    if (subtotal == null) return;
    if (subtotal >= 100000) setShipping(0);
    else setShipping(4000);
  }, [subtotal, products]);
  useEffect(() => {
    if (subtotal == null || shipping == null) return;
    setTotal(subtotal + shipping);
  }, [shipping, subtotal, products]);

  if (isLoading) return <Loading />;
  if (!products || products?.length === 0) return <EmptyCart />;
  return (
    <div className={styles.cart}>
      <div className={styles.yourCart}>
        <span>Your Cart</span>
      </div>
      <div className={styles.main}>
        <div className={styles.maintop}>
          <span className={styles.mainTopProduct}>상품 정보</span>
          <span className={styles.mainTopPrice}>가격</span>
          <span className={styles.mainTopQty}>수량</span>
          <span className={styles.mainTopTotal}>총 가격</span>
        </div>
        {products &&
          products.map((product: CartProductType, index: number) => (
            <CartCard
              product={product}
              key={`${index}${product.name}${product.cartStock.stock.size}`}
            />
          ))}
      </div>
      <div className={styles.total}>
        <div className={styles.totalMain}>
          <div className={styles.totalMenu}>
            <span>상품합계 금액</span>
            {subtotal && <span>{`₩${subtotal == null ? "" : subtotal}`}</span>}
          </div>
          <div className={styles.shipping}>
            <div className={styles.shippingMain}>
              <span>배송비</span>
              <BsQuestionCircle
                color={`${mainColor}`}
                size={12}
                className={styles.shippingIcon}
                onClick={() => {
                  setShippingTip((prev) => !prev);
                }}
              />
            </div>
            {shipping && <span>{`₩${shipping == null ? "" : shipping}`}</span>}
          </div>
          {shippingTip && (
            <div className={styles.totalMenu}>
              <span className={styles.shippingTip}>
                주문금액이 10만원 미만일 경우 배송비 4,000원이 추가 됩니다.
              </span>
            </div>
          )}
          <div className={styles.totalMenu}>
            <span>총 결제 금액</span>
            {total && <span>{`₩${total == null ? "" : total}`}</span>}
          </div>
        </div>
      </div>
      <div className={styles.checkOut}>
        <button
          type="submit"
          className={styles.button}
          onClick={() => {
            router.push("/order");
          }}
        >
          Check Out
        </button>
      </div>
    </div>
  );
}
