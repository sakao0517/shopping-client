"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function ShippingAndReturns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={styles.shippingAndReturns}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>Shipping And Returns</span>
        </div>
        <div className={styles.center}>
          <p>Shipping</p>
          <br />
          <p>
            발송은 결제 후 2-7일(토요일, 공휴일 제외) 소요됩니다.
            <br />
            모든 주문건은 합배송을 기준으로 합니다.
            <br />
            재고반영은 주문순입니다.
            <br />
            주문금액이 10만 원 미만일 경우 배송비 4,000원이 추가 됩니다.
            <br />
            도서/산간 지역은 추가 배송비 2,000원이 추가됩니다.
          </p>
          <br />
          <br />
          <br />
          <p>Exchange & Return</p>
          <br />
          <p>
            제품 수령 후 7일 이내 하단 양식대로 메일 접수 부탁드립니다.
            <br />
            brand@brand.com
            <br />
            <br />
            -교환/반품 양식-
            <br />
            *주문번호
            <br />
            *성함
            <br />
            *교환or반품 기재, 사유
            <br />
            <br />
            메일 접수 후 택배사를 통해 교환/반품 신청 해 주시면 됩니다.
            <br />
            단순 변심의 교환/반품은 왕복 배송료 (8,000원) 를 고객님께서 부담해
            주셔야 합니다.
            <br />
            반품주소 / 브랜드주소
          </p>
          <br />
          <br />
          <br />
          <p>교환/반품이 불가능한 경우</p>
          <p>
            <br />
            교환/반품 양식 사전 접수 없이, 일방적으로 보낸 상품. 교환/ 반품이
            불가능함을 따로 명시한 경우.
            <br />
            기간이 경과 한 경우 (제품 수령일로부터 7일 이내 요청)
            <br />
            고객님의 착용 및 수선 등으로 인한 제품이 변질된 경우 고객님에 의한
            상품, 라벨, 택 등이 멸실, 훼손 또는 오염되었을 경우
          </p>
        </div>
      </div>
    </div>
  );
}
