"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import { successOrder, verifyOrder } from "@/actions/order";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

function Success() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>("");
  useEffect(() => {
    if (!searchParams) return;
    setOrderId(searchParams.get("paymentId") as string);
  }, [searchParams]);
  useEffect(() => {
    async function verify() {
      try {
        await verifyOrder(orderId);
      } catch (error: any) {
        if (error.digest === "order already paid") {
          alert("이미 결제된 주문입니다.");
          return router.push("/");
        } else if (error.digest === "get user error") {
          alert("결제에 문제가 발생했습니다.");
          return router.push("/");
        } else if (error.digest === "get body error") {
          alert("결제에 문제가 발생했습니다.");
          return router.push("/");
        } else if (error.digest === "get order error") {
          alert("결제에 문제가 발생했습니다.");
          return router.push("/");
        } else if (error.digest) {
          alert(error.digest);
          return router.push("/order/fail");
        } else {
          alert("결제에 문제가 발생했습니다.");
          return router.push("/order/fail");
        }
      }
      setIsVerify(true);
    }
    if (!orderId || orderId === "") return;
    verify();
  }, [orderId]);
  useEffect(() => {
    async function success(orderId: string) {
      try {
        await successOrder(orderId);
      } catch (error) {
        if (error) {
          alert("문제가 발생했습니다. 다시 시도하세요.");
          return router.push("/order/fail");
        }
      }
      setIsComplete(true);
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    }
    if (!isVerify) return;
    if (!orderId) return;
    success(orderId);
  }, [isVerify]);
  useEffect(() => {
    if (!searchParams.get("paymentId")) {
      alert("잘못된 경로로 접근했습니다.");
      return router.push("/");
    }
  }, [searchParams]);

  if (!isComplete)
    return (
      <div className={styles.success}>
        <div className={styles.main}>
          <div className={styles.top}>
            <span>주문이 진행중입니다.</span>
          </div>
        </div>
      </div>
    );
  return (
    <div className={styles.success}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>고객님의 주문이 완료되었습니다.</span>
        </div>
        <div className={styles.goOrder}>
          <p>
            {"주문번호 : "}
            <Link href={`/account/order/${orderId}`}>{orderId}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
