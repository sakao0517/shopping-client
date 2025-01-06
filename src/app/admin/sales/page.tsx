"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./page.module.css";
import { OrderType } from "@/type/type";
import { getAdminAllOrder } from "@/actions/admin";
import { useEffect, useState } from "react";
import Loading from "@/app/_components/Loading/Loading";
import dayjs from "dayjs";
import Calendar from "react-calendar";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Sales() {
  const { data: orders, isLoading } = useQuery<OrderType[]>({
    queryKey: ["admin", "order", "all"],
    queryFn: () => getAdminAllOrder(),
  });
  const [value, onChange] = useState<Value>(new Date());
  const [salesToday, setSalesToday] = useState<number>(0);

  const [salesThisWeek, setSalesThisWeek] = useState<number>(0);
  const [salesThisMonth, setSalesThisMonth] = useState<number>(0);
  const [salesAll, setSalesAll] = useState<number>(0);
  const [salesCalendar, setSalesCalendar] = useState<number>(0);
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

  useEffect(() => {
    if (!orders) return;
    const calendarDay = dayjs(value?.toString()).format("YYYY-MM-DD");
    let tmpSalesCalendar = 0;
    orders.map((order) => {
      const diffCalendar = dayjs(order.createdAt.split("T")[0]).diff(
        calendarDay,
        "day"
      );
      if (diffCalendar === 0) tmpSalesCalendar += order.amount;
    });
    setSalesCalendar(tmpSalesCalendar);
  }, [value, orders]);
  if (isLoading) return <Loading />;
  return (
    <div className={styles.sales}>
      <div className={styles.main}>
        <div className={styles.top}>
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
        <div className={styles.center}>
          <Calendar onChange={onChange} value={value} />
        </div>
        <div className={styles.bottom}>
          <div className={styles.day}>
            <span>
              {dayjs(value?.toString()).format("YYYY년MM월DD일 매출 ")}
            </span>
            <span style={{ color: "red" }}>{`₩${salesCalendar}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
