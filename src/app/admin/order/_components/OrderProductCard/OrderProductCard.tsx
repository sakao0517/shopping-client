import styles from "./OrderProductCard.module.css";
import { CartProductType } from "@/type/type";
import { Dispatch, SetStateAction } from "react";

export default function OrderProductCard({
  cartProduct,
  setIsClick,
}: {
  cartProduct: CartProductType;
  setIsClick: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.orderProductCard}>
      <div
        className={styles.orderDetailImg}
        onClick={() => {
          setIsClick((prev) => !prev);
        }}
      >
        <img src={cartProduct.img[0]} alt={cartProduct.name} />
      </div>
      <div className={styles.orderDetailInfo}>
        <div>
          <span
            onClick={() => {
              setIsClick((prev) => !prev);
            }}
          >
            {cartProduct.name}
          </span>
        </div>
        <div>
          <span
            onClick={() => {
              setIsClick((prev) => !prev);
            }}
          >{`size: ${cartProduct.cartStock.stock.size}`}</span>
        </div>
        <div>
          <span
            onClick={() => {
              setIsClick((prev) => !prev);
            }}
          >{`₩${cartProduct.price}`}</span>
        </div>
        <div>
          <span
            onClick={() => {
              setIsClick((prev) => !prev);
            }}
          >{`수량: ${cartProduct.cartStock.stock.qty}`}</span>
        </div>
      </div>
    </div>
  );
}
