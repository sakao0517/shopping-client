"use client";

import Link from "next/link";
import stlyes from "./ProductCart.module.css";
import { ProductType } from "@/type/type";
import { useState } from "react";

export default function ProductCard({ product }: { product: ProductType }) {
  const [onMouse, setOnMouse] = useState(false);
  if (product.isVisible) return null;
  return (
    <div className={stlyes.productCard}>
      <Link
        className={stlyes.image}
        href={`/collections/product/${product.id}`}
      >
        <img
          onMouseEnter={() => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIos =
              userAgent.indexOf("iphone") > -1 ||
              (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
            if (isIos) return;
            setOnMouse(true);
          }}
          onMouseLeave={() => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIos =
              userAgent.indexOf("iphone") > -1 ||
              (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
            if (isIos) return;
            setOnMouse(false);
          }}
          src={onMouse ? product.img[1] : product.img[0]}
        />
      </Link>
      <Link href={`/collections/product/${product.id}`}>{product.name}</Link>
      <p>{`₩${product.price}`}</p>
    </div>
  );
}
