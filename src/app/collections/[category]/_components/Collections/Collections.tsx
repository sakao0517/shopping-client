"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./Collections.module.css";
import { getProducts } from "@/actions/product";
import Link from "next/link";
import { ProductType } from "@/type/type";
import { useEffect, useState } from "react";
import ProductCard from "@/app/_components/ProductCard/ProductCart";
import { useRouter } from "next/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { mainColor } from "@/app/_config/ColorSetting";
import LoadingWithoutPadding from "@/app/_components/LoadingWithoutPadding/LoadingWithoutPadding";

interface CollectionsResponse {
  products: ProductType[];
  totalLength: number;
}

export default function Collections({
  categories,
  category,
  currentPage,
  productMaxLength,
}: {
  categories: string[];
  category: string;
  currentPage: number;
  productMaxLength: number;
}) {
  const [currentCategory] = useState(category);
  const [maxPage, setMaxPage] = useState(1);
  const router = useRouter();
  const { data: productsResponse, isLoading } = useQuery<CollectionsResponse>({
    queryKey: ["collections", category, currentPage],
    queryFn: () => getProducts(category, currentPage),
  });
  useEffect(() => {
    if (!productsResponse) return;
    if (!productsResponse?.totalLength) return;
    const totalPages = Math.ceil(
      productsResponse.totalLength / productMaxLength
    );
    setMaxPage(totalPages);
  }, [productsResponse, productMaxLength]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, currentPage]);
  if (isLoading) return <LoadingWithoutPadding />;
  return (
    <div className={styles.main}>
      {categories && (
        <div className={styles.category}>
          {categories.map((category, index) => {
            if (category === "x") return;
            return (
              <Link
                key={index}
                className={
                  category === currentCategory ? `${styles.selectCategory}` : ``
                }
                href={`/collections/${category}?page=1`}
              >
                {category}
              </Link>
            );
          })}
        </div>
      )}
      <div className={styles.products}>
        {productsResponse?.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.page}>
        {currentPage > 10 && (
          <span
            className={styles.arrow}
            onClick={() => {
              const prevFirstPage = Math.floor((currentPage - 1) / 10) * 10 - 9;
              router.push(`/collections/${category}?page=${prevFirstPage}`);
            }}
          >
            <AiOutlineLeft size={12} color={`${mainColor}`} />
          </span>
        )}
        {Array.from(
          {
            length: Math.min(
              10,
              maxPage - Math.floor((currentPage - 1) / 10) * 10
            ),
          },
          (v, i) => Math.floor((currentPage - 1) / 10) * 10 + i + 1
        ).map((page) => (
          <span
            className={page === currentPage ? `${styles.selectPage}` : ``}
            key={page}
            onClick={() => {
              router.push(`/collections/${category}?page=${page}`);
            }}
          >
            {page}
          </span>
        ))}
        {Math.floor((currentPage - 1) / 10) * 10 + 10 < maxPage && (
          <span
            className={styles.arrow}
            onClick={() => {
              const nextFirstPage =
                Math.floor((currentPage - 1) / 10) * 10 + 11;
              router.push(`/collections/${category}?page=${nextFirstPage}`);
            }}
          >
            <AiOutlineRight size={12} color={`${mainColor}`} />
          </span>
        )}
      </div>
    </div>
  );
}
