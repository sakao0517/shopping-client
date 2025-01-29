"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./InputCard.module.css";
export default function InputCard({
  index,
  category,
  setCategory,
}: {
  index: number;
  category: string[];
  setCategory: Dispatch<SetStateAction<string[]>>;
}) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [newCate, setNewCate] = useState(category[index]);
  return (
    <div className={styles.inputCard}>
      <div className={styles.inputCartInput}>
        <input
          disabled={!isUpdate || category[index] === "new"}
          value={newCate}
          onChange={(e) => {
            setNewCate(e.target.value);
          }}
        />
      </div>
      {isUpdate ? (
        <div className={styles.inputCardButton}>
          <button
            onClick={() => {
              if (category[index] === "new") return;
              const tmpCategory = category.slice();
              tmpCategory[index] = newCate;
              setCategory(tmpCategory);
              setIsUpdate(false);
            }}
          >
            확인
          </button>
        </div>
      ) : (
        <div className={styles.inputCardButton}>
          <button
            disabled={category[index] === "new" || category[index] === "x"}
            onClick={() => {
              if (category[index] === "new" || category[index] === "x") return;
              setIsUpdate(true);
            }}
          >
            수정
          </button>
        </div>
      )}
      <div className={styles.inputCardButton}>
        <button
          disabled={category[index] === "new" || category[index] === "x"}
          onClick={() => {
            if (category[index] === "new" || category[index] === "x") return;
            const tmpCategory = category.slice();
            tmpCategory.splice(index, 1);
            setCategory(tmpCategory);
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
