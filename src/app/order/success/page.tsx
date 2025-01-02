"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import { confirmOrder, successOrder, verifyOrder } from "@/actions/order";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

function Success() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  useEffect(() => {
    async function verify(orderId: string, amount: string) {
      try {
        await verifyOrder(orderId, Number(amount));
      } catch (error: any) {
        if (error.digest === "amount error") {
          alert("상품가격과 결제가격이 다릅니다.");
          return router.push("/order/fail");
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
    if (!orderId || !paymentKey || !amount) return;
    verify(orderId, amount);
  }, [orderId, paymentKey, amount]);
  useEffect(() => {
    async function confirm(
      orderId: string,
      paymentKey: string,
      amount: string
    ) {
      try {
        const json = await confirmOrder(orderId, paymentKey, amount);
        if (json.orderId === orderId) setIsSuccess(true);
      } catch (error: any) {
        if (error.digest) {
          alert(error.digest);
          return router.push("/order/fail");
        } else {
          alert("문제가 발생했습니다. 다시 시도하세요.");
          return router.push("/order/fail");
        }
      }
    }
    if (!isVerify) return;
    if (!orderId || !paymentKey || !amount) return;
    confirm(orderId, paymentKey, amount);
  }, [isVerify]);
  useEffect(() => {
    async function success(orderId: string, paymentKey: string) {
      try {
        await successOrder(orderId, paymentKey);
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
    if (!isSuccess) return;
    if (!orderId || !paymentKey || !amount) return;
    success(orderId, paymentKey);
  }, [isSuccess]);
  useEffect(() => {
    if (!orderId || !paymentKey) {
      alert("잘못된 경로로 접근했습니다.");
      return router.push("/");
    }
  }, [orderId, paymentKey]);
  if (!isComplete)
    return (
      <div className={styles.success}>
        <div className={styles.main}>
          <span>주문이 진행 중입니다.</span>
        </div>
      </div>
    );
  return (
    <div className={styles.success}>
      <div className={styles.main}>
        <span>고객님의 주문이 완료 되었습니다.</span>
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
