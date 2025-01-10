"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { CategoryType, ProductType, UserType } from "@/type/type";
import { getAdminProducts } from "@/actions/admin";
import AdminProductCard from "./_components/AdminProductCard/AdminProductCard";
import AdminAddProduct from "./_components/AdminAddProduct/AdminAddProduct";
import { getUserInfo } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { getCategory } from "@/actions/category";
import { mainColor } from "@/app/_config/ColorSetting";
import Loading from "@/app/_components/Loading/Loading";

interface ProductResponse {
  products: ProductType[];
  totalLength: number;
}

export default function Product() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState("name");
  const [filter, setFilter] = useState("createdAt");
  const [options, setOptions] = useState("?createdAt=-1&page=1");
  const [nameFilter, setNameFilter] = useState("오름차순");
  const [createdAtFilter, setCreatedAtFilter] = useState("최신순");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("높은 가격 순");
  const [isAdd, setIsAdd] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const { data: productsResponse } = useQuery<ProductResponse>({
    queryKey: ["admin", "collections", categoryFilter, options],
    queryFn: () => getAdminProducts(categoryFilter, options),
  });
  const { data: categoryData } = useQuery<CategoryType>({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });
  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (search) {
      searchParams.set("q", search);
      searchParams.set("searchFilter", searchFilter);
    }
    if (filter === "name") {
      if (nameFilter === "오름차순") {
        searchParams.set("name", "1");
      } else {
        searchParams.set("name", "-1");
      }
    } else if (filter === "createdAt") {
      if (createdAtFilter === "최신순") {
        searchParams.set("createdAt", "-1");
      } else {
        searchParams.set("createdAt", "1");
      }
    } else if (filter === "price") {
      if (priceFilter === "높은 가격 순") {
        searchParams.set("price", "-1");
      } else {
        searchParams.set("price", "1");
      }
    }
    searchParams.set("page", "1");
    setOptions(`?${searchParams.toString()}`);
    setCurrentPage(1);
  }, [
    filter,
    nameFilter,
    createdAtFilter,
    priceFilter,
    search,
    searchFilter,
    categoryFilter,
  ]);
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(options);
    searchParams.set("q", search);
    searchParams.set("searchFilter", searchFilter);
    searchParams.set("page", "1");
    setOptions(`?${searchParams.toString()}`);
    setCurrentPage(1);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(options);
    searchParams.set("page", String(currentPage));
    setOptions(`?${searchParams.toString()}`);
  }, [currentPage]);
  useEffect(() => {
    if (isError) router.push("/");
    if (!isLoading) {
      if (userInfo?.isAdmin === true) setUserIsAdmin(true);
      else router.push("/");
    }
  }, [userInfo, isLoading, isError]);
  useEffect(() => {
    if (!productsResponse) return;
    setMaxPage(Math.ceil(productsResponse.totalLength / 10));
  }, [productsResponse]);
  if (isLoading) return <Loading />;
  if (!userIsAdmin) return <div className={styles.product}></div>;
  return (
    <div className={styles.product}>
      <div className={styles.main}>
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.searchSelect}>
            <select
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
            >
              <option value={"name"}>상품명</option>
              <option value={"price"}>가격</option>
            </select>
          </div>
          <div className={styles.searchInput}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className={styles.searchButton}>
            <button>검색</button>
          </div>
        </form>
        <div className={styles.addProductButton}>
          {isAdd ? (
            <button
              onClick={() => {
                setIsAdd(false);
              }}
            >
              취소하기
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAdd(true);
              }}
            >
              상품 추가하기
            </button>
          )}
        </div>
        {isAdd && (
          <div className={styles.addProduct}>
            <AdminAddProduct />
          </div>
        )}
        <div className={styles.top}>
          <div
            className={`${styles.topName} ${
              filter === "name" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("name");
              }}
            >
              상품명
            </span>
            <select
              value={nameFilter}
              onChange={(e) => {
                setNameFilter(e.target.value);
              }}
            >
              <option value={"오름차순"}>오름차순</option>
              <option value={"내림차순"}>내림차순</option>
            </select>
          </div>
          <div className={styles.topCategory}>
            <span>카테고리</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
              }}
            >
              <option value={"all"}>all</option>
              {categoryData?.category.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`${styles.topMenu} ${
              filter === "createdAt" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("createdAt");
              }}
            >
              등록일
            </span>
            <select
              value={createdAtFilter}
              onChange={(e) => {
                setCreatedAtFilter(e.target.value);
              }}
            >
              <option value={"최신순"}>최신순</option>
              <option value={"오래된순"}>오래된순</option>
            </select>
          </div>
          <div
            className={`${styles.topMenu} ${styles.topPrice} ${
              filter === "price" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("price");
              }}
            >
              가격
            </span>
            <select
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value);
              }}
            >
              <option value={"높은 가격 순"}>높은 가격 순</option>
              <option value={"낮은 가격 순"}>낮은 가격 순</option>
            </select>
          </div>
        </div>
        <div className={styles.center}>
          {productsResponse?.products.map((product) => (
            <AdminProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className={styles.page}>
        {currentPage > 10 && (
          <span
            className={styles.arrow}
            onClick={() => {
              const prevFirstPage = Math.floor((currentPage - 1) / 10) * 10 - 9;
              setCurrentPage(prevFirstPage);
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
              setCurrentPage(page);
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
              setCurrentPage(nextFirstPage);
            }}
          >
            <AiOutlineRight size={12} color={`${mainColor}`} />
          </span>
        )}
      </div>
    </div>
  );
}
