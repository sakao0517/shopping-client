"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getCategory, updateCategory } from "@/actions/category";
import { CategoryType } from "@/type/type";
import InputCard from "./_components/InputCard/InputCard";

export default function Category() {
  const queryClient = useQueryClient();
  const { data } = useQuery<CategoryType>({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });
  const [category, setCategory] = useState<string[]>([]);
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
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
  return (
    <div className={styles.category}>
      <div className={styles.main}>
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
        <div className={styles.button}>
          <button
            onClick={() => {
              const tmpCategory = category.slice();
              tmpCategory.push("");
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
