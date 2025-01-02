import Link from "next/link";
import styles from "./EmptyCart.module.css";

export default function EmptyCart() {
  return (
    <div className={styles.emptyCart}>
      <div className={styles.main}>
        <span>장바구니에 담은 상품이 없습니다.</span>
        <div className={styles.goHome}>
          <p>
            <Link href={"/collections/new"}>Continue browsing here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
