import { CartProductType } from "@/type/type";
import styles from "./OrderCard.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderCard({ product }: { product: CartProductType }) {
  const [total, setTotal] = useState<number>();
  useEffect(() => {
    const cal = Number(product.price) * Number(product.cartStock.stock.qty);
    setTotal(cal);
  }, [product]);
  return (
    <div className={styles.mainCenter}>
      <Link
        href={`/collections/product/${product.id}`}
        className={styles.image}
      >
        <img src={product.img[0]} />
      </Link>
      <div className={styles.product}>
        <div className={styles.productDetail}>
          <div>
            <Link href={`/collections/product/${product.id}`}>
              {product.name}
            </Link>
          </div>
          <p>{`size: ${product.cartStock.stock.size.toUpperCase()}`}</p>
        </div>
        <div className={styles.price}>
          <span>{`₩${product?.price}`}</span>
        </div>
        <div className={styles.qtyAndRemove}>
          <span>{product.cartStock.stock.qty}</span>
        </div>
        <div className={styles.total}>{`₩${total}`}</div>
      </div>
    </div>
  );
}
