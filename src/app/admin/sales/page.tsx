"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./page.module.css";
import { OrderType } from "@/type/type";
import { getAdminAllOrder } from "@/actions/admin";
import { useEffect, useState } from "react";
import Loading from "@/app/_components/Loading/Loading";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import ProductCard from "./_components/ProductCard/ProductCard";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export type RankingProduct = {
  id: string;
  name: string;
  img: string[];
  price: number;
  sales: number;
  size: string;
};

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
  const [rankingArray, setRankingArray] = useState<RankingProduct[]>([]);
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
  useEffect(() => {
    if (!orders) return;
    const calendarDay = dayjs(value?.toString()).format("YYYY-MM-DD");
    const tmpRankingArray: RankingProduct[] = [];

    orders.forEach((order) => {
      if (order.createdAt.split("T")[0] !== calendarDay) return;
      order.cart.forEach((item) => {
        const findProductIndex = tmpRankingArray.findIndex(
          (product) =>
            product.name === item.name &&
            product.price === item.price &&
            JSON.stringify(product.img) === JSON.stringify(item.img) &&
            product.size === item.cartStock.stock.size
        );

        if (findProductIndex !== -1) {
          tmpRankingArray[findProductIndex].sales += item.cartStock.stock.qty;
        } else {
          tmpRankingArray.push({
            id: item.id,
            name: item.name,
            img: item.img,
            price: item.price,
            sales: item.cartStock.stock.qty,
            size: item.cartStock.stock.size,
          });
        }
      });
    });
    tmpRankingArray.sort((a, b) => b.sales - a.sales);
    setRankingArray(tmpRankingArray);
  }, [orders, value]);
  if (isLoading) return <Loading />;
  return (
    <div className={styles.sales}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>매출</span>
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
          <div className={styles.ranking}>
            <div className={styles.rankingTop}>
              <div className={styles.rankingTopRanking}>판매순위</div>
              <div className={styles.day}>
                <span>
                  {dayjs(value?.toString()).format("YYYY년MM월DD일 매출")}
                </span>
                <span className={styles.dayAir}>&nbsp;</span>
                <span style={{ color: "red" }}>{`₩${salesCalendar}`}</span>
              </div>
              <div className={styles.rankingTopQty}>판매수</div>
            </div>
            <div className={styles.rankingMain}>
              {!rankingArray || rankingArray?.length === 0 ? (
                <span className={styles.rankingArrayNull}>
                  주문내역이 없습니다.
                </span>
              ) : (
                rankingArray.map((product, index) => (
                  <ProductCard
                    key={`${product.name}${index}`}
                    product={product}
                    index={index}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
