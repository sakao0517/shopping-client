"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { OrderType, UserType } from "@/type/type";
import { getUserInfo } from "@/actions/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminAllOrder } from "@/actions/admin";
import Loading from "../_components/Loading/Loading";
import dayjs from "dayjs";

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
  const [salesToday, setSalesToday] = useState<number>(0);
  const [salesThisWeek, setSalesThisWeek] = useState<number>(0);
  const [salesThisMonth, setSalesThisMonth] = useState<number>(0);
  const [salesAll, setSalesAll] = useState<number>(0);
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
    if (!orders) return;
    function getMonday(d: Date) {
      d = new Date(d);
      const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }
    const today = dayjs(new Date()).format("YYYY-MM-DD");
    const thisWeekMonday = dayjs(getMonday(new Date())).format("YYYY-MM-DD");
    const firstDay = dayjs(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).format("YYYY-MM-DD");
    let tmpSalesToday = 0;
    let tmpSalesThisWeek = 0;
    let tmpSalesThisMonth = 0;
    let tmpSalesAll = 0;
    orders.map((order) => {
      tmpSalesAll += order.amount;
      const diffToday = dayjs(order.createdAt.split("T")[0]).diff(today, "day");
      const diffWeek = dayjs(order.createdAt.split("T")[0]).diff(
        thisWeekMonday,
        "week"
      );
      const diffMonth = dayjs(order.createdAt.split("T")[0]).diff(
        firstDay,
        "month"
      );
      if (diffToday === 0) tmpSalesToday += order.amount;
      if (diffWeek === 0) tmpSalesThisWeek += order.amount;
      if (diffMonth === 0) tmpSalesThisMonth += order.amount;
    });
    setSalesToday(tmpSalesToday);
    setSalesThisWeek(tmpSalesThisWeek);
    setSalesThisMonth(tmpSalesThisMonth);
    setSalesAll(tmpSalesAll);
  }, [orders]);

  if (isLoading) return <Loading />;
  if (!userIsAdmin) return <div className={styles.admin}></div>;
  return (
    <div className={styles.admin}>
      <div className={styles.main}>
        <div className={styles.orderMenu}>
          <div>
            <Link href="/admin/sales">매출</Link>
          </div>
          <div>
            <span style={{ color: "red" }}>오늘 매출 </span>
            <span style={{ color: "red" }}>{`₩${salesToday}`}</span>
          </div>
          <div>
            <span>이번주 매출 </span>
            <span>{`₩${salesThisWeek}`}</span>
          </div>
          <div>
            <span>이번달 매출 </span>
            <span>{`₩${salesThisMonth}`}</span>
          </div>
          <div>
            <span>전체 매출 </span>
            <span>{`₩${salesAll}`}</span>
          </div>
        </div>
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
            <span>반품 완료 </span>
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
          <Link href={"/admin/product"}>상품 관리</Link>
        </div>
        <div>
          <Link href={"/admin/auth"}>사용자 관리</Link>
        </div>
        <div>
          {/* 브랜드 pg상점 관리 */}
          <a
            href={"https://admin.portone.io/payments"}
            target="_blank"
            style={{ color: "red" }}
          >
            PG상점관리자
          </a>
        </div>
        <div>
          {/* 브랜드 이미지 관리 */}
          <a href={"https://console.cloudinary.com/console"} target="_blank">
            cloudinary (이미지 관리)
          </a>
        </div>
        <div>
          {/* 브랜드 방문자 통계 */}
          <a href={"https://vercel.com/"} target="_blank">
            vercel (방문자 통계)
          </a>
        </div>
      </div>
    </div>
  );
}
