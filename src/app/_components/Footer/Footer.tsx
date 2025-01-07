"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) window.scrollTo(0, 9999999);
  }, [isOpen]);
  return (
    <div className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            브랜드이름
          </span>
          <div className={styles.topMenu}>
            <Link href="/legal">Legal</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/shippingAndReturns">Shipping and Returns</Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>
          </div>
          <span></span>
        </div>
        {isOpen && (
          <div className={styles.bottom}>
            <p>
              법인명 : 브랜드이름 | 대표 : 김대표 | 이메일 : brand@brand.com
            </p>
            <p>
              사업자 등록번호 : 123-12-12345 | 통신판매업 신고 :
              2024-서울강남-1234
            </p>
            <p>주소 : 서울시 강남구 테헤란로 123 123호</p>
          </div>
        )}
      </div>
    </div>
  );
}
