"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getCategory, updateCategory } from "@/actions/category";
import { CategoryType } from "@/type/type";
import InputCard from "./_components/InputCard/InputCard";
import Loading from "@/app/_components/Loading/Loading";

export default function Category() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<CategoryType>({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });
  const [category, setCategory] = useState<string[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [timeOut, setTimeOut] = useState<any>();
  useEffect(() => {
    if (!data) return;
    setCategory(data.category);
  }, [data]);
  const updateMutate = useMutation({
    mutationFn: async () => {
      if (!data) return;
      await updateCategory(data?.id, category);
    },
    onSuccess: () => {
      clearTimeout(timeOut);
      queryClient.invalidateQueries({ queryKey: ["category"] });
      setIsUpdate(true);
      setTimeOut(
        setTimeout(() => {
          setIsUpdate(false);
        }, 500)
      );
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });
  if (isLoading) return <Loading />;
  return (
    <div className={styles.category}>
      <div className={`${styles.main} ${isUpdate ? styles.isUpdate : ""}`}>
        <p>카테고리</p>
        {category &&
          category.map((cate, index) => (
            <InputCard
              key={`${cate}${index}`}
              index={index}
              category={category}
              setCategory={setCategory}
            />
          ))}
        <div className={styles.tip}>
          <span>카테고리가 중복되지 않게 주의해 주세요.</span>
          <span>new, x 카테고리는 삭제되지 않습니다.</span>
        </div>
        <div className={styles.button}>
          <button
            onClick={() => {
              const tmpCategory = category?.length > 0 ? category.slice() : [];
              tmpCategory.push("new category");
              setCategory(tmpCategory);
            }}
          >
            카테고리 추가
          </button>
          <button
            onClick={() => {
              updateMutate.mutate();
            }}
          >
            카테고리 변경
          </button>
        </div>
      </div>
    </div>
  );
}
