"use client";

import { Stock } from "@/type/type";
import styles from "./StockCard.module.css";
import { Dispatch, SetStateAction, useState } from "react";

export default function StockCard({
  index,
  stock,
  setStock,
}: {
  index: number;
  stock: Stock[];
  setStock: Dispatch<SetStateAction<Stock[]>>;
}) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [size, setSize] = useState(stock[index].size);
  const [qty, setQty] = useState(stock[index].qty);
  const handleDelete = () => {
    const newStock = stock.slice();
    newStock.splice(index, 1);
    setStock(newStock);
  };

  return (
    <div className={styles.stockCard}>
      <div className={styles.size}>
        <input
          disabled={!isUpdate}
          value={size}
          onChange={(e) => {
            setSize(e.target.value);
          }}
        />
      </div>
      <div className={styles.qty}>
        <input
          disabled={!isUpdate}
          value={qty}
          onChange={(e) => {
            const value = e.target.value
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1");
            setQty(Number(value));
          }}
        />
      </div>
      <div className={styles.updateButton}>
        {isUpdate ? (
          <button
            onClick={() => {
              const tmpStock = stock.slice();
              tmpStock[index].qty = qty;
              tmpStock[index].size = size;
              setStock(tmpStock);
              setIsUpdate(false);
            }}
          >
            확인
          </button>
        ) : (
          <button
            onClick={() => {
              setIsUpdate(true);
            }}
          >
            수정
          </button>
        )}
      </div>
      <div className={styles.delete}>
        <button onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
}
