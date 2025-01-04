"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { OrderType, UserType } from "@/type/type";
import { getUserInfo } from "@/actions/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminAllOrder } from "@/actions/admin";

export default function Admin() {
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const { data: orders } = useQuery<OrderType[]>({
    queryKey: ["admin", "order", "all"],
    queryFn: () => getAdminAllOrder(),
  });
  const router = useRouter();
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [setOrderChecking, setOrderCheckingsetOrderChecking] =
    useState<number>(0);
  const [shipmentPreparing, setShipmentPreparing] = useState<number>(0);
  const [shipmentComplete, setShipmentComplete] = useState<number>(0);
  const [returnOrdering, setReturnOrdering] = useState<number>(0);
  const [returnComplete, setReturnComplete] = useState<number>(0);

  useEffect(() => {
    if (isError) router.push("/");
    if (!isLoading) {
      if (userInfo?.isAdmin === true) setUserIsAdmin(true);
      else router.push("/");
    }
  }, [userInfo, isLoading, isError]);

  useEffect(() => {
    if (!orders) return;

    // 카운터 초기화
    setOrderCheckingsetOrderChecking(0);
    setShipmentPreparing(0);
    setShipmentComplete(0);
    setReturnOrdering(0);
    setReturnComplete(0);
    orders.forEach((order) => {
      switch (order.orderStatus) {
        case "주문 확인 중":
          setOrderCheckingsetOrderChecking((prev) => prev + 1);
          break;
        case "발송 준비 중":
          setShipmentPreparing((prev) => prev + 1);
          break;
        case "발송 완료":
          setShipmentComplete((prev) => prev + 1);
          break;
        case "반품 진행 중":
          setReturnOrdering((prev) => prev + 1);
          break;
        case "반품 완료":
          setReturnComplete((prev) => prev + 1);
          break;
      }
    });
  }, [orders]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!userIsAdmin) return <div className={styles.admin}></div>;
  return (
    <div className={styles.admin}>
      <div className={styles.main}>
        <div className={styles.orderMenu}>
          <div>
            <Link href={"/admin/order"}>주문 관리</Link>
          </div>
          <div>
            <span style={{ color: "red" }}>주문 확인 중 </span>
            <span style={{ color: "red" }}>{setOrderChecking}</span>
          </div>
          <div>
            <span>발송 준비 중 </span>
            <span>{shipmentPreparing}</span>
          </div>
          <div>
            <span>발송 완료 </span>
            <span>{shipmentComplete}</span>
          </div>
          <div>
            <span>반품 진행 중 </span>
            <span>{returnOrdering}</span>
          </div>
          <div>
            <span>반품 완료</span>
            <span>{returnComplete}</span>
          </div>
        </div>
        <div>
          <Link href={"/admin/home"}>메인페이지 관리</Link>
        </div>
        <div>
          <Link href={"/admin/category"}>카테고리 관리</Link>
        </div>
        <div>
          <Link href={"/admin/product"}>제품 관리</Link>
        </div>
        <div>
          <Link href={"/admin/auth"}>사용자 관리</Link>
        </div>
        <div>
          <a href={"https://naver.com"} target="_blank">
            토스 상점관리자
          </a>
        </div>
        <div>
          <a href={"https://console.cloudinary.com/console"} target="_blank">
            cloudinary
          </a>
        </div>
        <div>
          <a href={"https://vercel.com/"} target="_blank">
            vercel
          </a>
        </div>
      </div>
    </div>
  );
}
