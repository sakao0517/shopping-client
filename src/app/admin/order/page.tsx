"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { OrderType, UserType } from "@/type/type";
import { getAdminOrder } from "@/actions/admin";
import OrderCard from "./_components/OrderCard/OrderCard";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/actions/auth";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { mainColor } from "@/app/_config/ColorSetting";
import Loading from "@/app/_components/Loading/Loading";

interface OrderResponse {
  orders: OrderType[];
  totalLength: number;
}

export default function Order() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [searchFilter, setSearchFilter] = useState("orderId");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("createdAt");
  const [options, setOptions] = useState("?createdAt=-1");
  const [orderStatusFilter, setOrderStatusFilter] = useState("전체");
  const [createdAtFilter, setCreatedAtFilter] = useState("최신순");
  const [amountFilter, setAmountFilter] = useState("높은 가격 순");
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const { data: ordersResponse } = useQuery<OrderResponse>({
    queryKey: ["admin", "order", options],
    queryFn: () => getAdminOrder(options),
  });
  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (search) {
      searchParams.set("q", search);
      searchParams.set("searchFilter", searchFilter);
    }

    if (orderStatusFilter !== "전체")
      searchParams.set("orderStatus", orderStatusFilter);
    if (filter === "createdAt") {
      if (createdAtFilter === "최신순") {
        searchParams.set("createdAt", "-1");
      } else {
        searchParams.set("createdAt", "1");
      }
    } else if (filter === "amount") {
      if (amountFilter === "높은 가격 순") {
        searchParams.set("amount", "-1");
      } else {
        searchParams.set("amount", "1");
      }
    }
    searchParams.set("page", "1");
    setOptions(`?${searchParams.toString()}`);
    setCurrentPage(1);
  }, [filter, createdAtFilter, amountFilter, orderStatusFilter]);
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
    if (!ordersResponse) return;
    setMaxPage(Math.ceil(ordersResponse.totalLength / 10));
  }, [ordersResponse]);
  if (isLoading) return <Loading />;
  if (!userIsAdmin) return <div className={styles.order}></div>;
  return (
    <div className={styles.order}>
      <div className={styles.main}>
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.searchSelect}>
            <select
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
            >
              <option value={"orderId"}>주문번호</option>
              <option value={"amount"}>구매가격</option>
              <option value={"name"}>이름</option>
              <option value={"email"}>이메일</option>
              <option value={"phone"}>휴대전화</option>
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
        <div className={styles.top}>
          <div className={styles.topOrder}>
            <span>주문상품</span>
          </div>
          <div className={styles.topOrderStatus}>
            <span>주문 상태</span>
            <select
              value={orderStatusFilter}
              onChange={(e) => {
                setOrderStatusFilter(e.target.value);
              }}
            >
              <option value={"전체"}>전체</option>
              <option value={"주문 확인 중"}>주문 확인 중</option>
              <option value={"발송 준비 중"}>발송 준비 중</option>
              <option value={"발송 완료"}>발송 완료</option>
              <option value={"반품 진행 중"}>반품 진행 중</option>
              <option value={"반품 완료"}>반품 완료</option>
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
              주문 일자
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
            className={`${styles.topMenu} ${
              filter === "amount" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("amount");
              }}
            >
              구매가격
            </span>
            <select
              value={amountFilter}
              onChange={(e) => {
                setAmountFilter(e.target.value);
              }}
            >
              <option value={"높은 가격 순"}>높은 가격 순</option>
              <option value={"낮은 가격 순"}>낮은 가격 순</option>
            </select>
          </div>
        </div>
        {/* todo key변경하기 */}
        <div className={styles.center}>
          {ordersResponse?.orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
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
