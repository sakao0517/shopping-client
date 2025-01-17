import Link from "next/link";
import { RankingProduct } from "../../page";
import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  index,
}: {
  product: RankingProduct;
  index: number;
}) {
  return (
    <div className={styles.productCard}>
      <div className={styles.index}>
        <span>{index + 1}</span>
      </div>
      <div className={styles.product}>
        <div className={styles.img}>
          <Link
            className={styles.image}
            href={`/collections/product/${product.id}`}
          >
            <img src={product.img[0]} />
          </Link>
        </div>
        <div className={styles.productDetail}>
          <div>
            <Link href={`/collections/product/${product.id}`}>
              {product.name}
            </Link>
          </div>
          <p>{`₩${product.price}`}</p>
          <p>{`size: ${product.size}`}</p>
        </div>
      </div>
      <div className={styles.sales}>
        <span>{product.sales}</span>
      </div>
    </div>
  );
}
