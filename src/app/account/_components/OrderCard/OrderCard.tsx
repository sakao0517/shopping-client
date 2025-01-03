import Link from "next/link";
import styles from "./OrderCard.module.css";
import { OrderType } from "@/type/type";
import dayjs from "dayjs";

dayjs.locale("ko");

export default function OrderCard({ order }: { order: OrderType }) {
  return (
    <div className={styles.mainOrderCenter}>
      <span className={styles.mainOrderCenterOrder}>
        <Link href={`/account/order/${order.orderId}`}>{order.orderId}</Link>
      </span>
      <span className={styles.mainOrderCenterDate}>
        {order?.createdAt ? dayjs(order.createdAt).format("YY.MM.DD") : ""}
      </span>
      <span className={styles.mainOrderCenterTotal}>{`₩${order.amount}`}</span>
    </div>
  );
}
