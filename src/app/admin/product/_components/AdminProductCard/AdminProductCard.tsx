"use client";

import { CategoryType, ProductType } from "@/type/type";
import styles from "./AdminProductCard.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import StockCard from "../StockCard/StockCard";
import ImageCard from "../ImageCard/ImageCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminProduct,
  updateAdminProduct,
  updateDateAdminProduct,
} from "@/actions/admin";
import { getCategory } from "@/actions/category";
import { BsChevronUp } from "react-icons/bs";

dayjs.locale("ko");

export default function AdminProductCard({
  product,
}: {
  product: ProductType;
}) {
  const queryClient = useQueryClient();
  const [isClick, setIsClick] = useState(false);
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [stock, setStock] = useState(product.stock);
  const [img, setImg] = useState(product.img);
  const [isNew, setIsNew] = useState<boolean>(product.isNew);
  const handleStockButton = () => {
    const newStock = stock.slice();
    newStock.push({ size: "size", qty: 0 });
    setStock(newStock);
  };
  const handleImgButton = () => {
    const newImg = img.slice();
    newImg.push(
      "https://02.cdn37.se/ak1/images/2.820508/hope-rush-relaxed-bootcut-jeans-washed-black.jpeg"
    );
    setImg(newImg);
  };
  const { data: categoryData } = useQuery<CategoryType>({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });
  const updateDateMutate = useMutation({
    mutationFn: async () => {
      await updateDateAdminProduct(product.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
    },
  });
  const updateProductMutate = useMutation({
    mutationFn: async () => {
      await updateAdminProduct(
        product.id,
        name,
        price,
        category,
        img,
        stock,
        description,
        isNew
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
    },
  });
  const deleteProductMutate = useMutation({
    mutationFn: async () => {
      await deleteAdminProduct(product.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
    },
  });
  return (
    <div
      className={`${styles.adminProductcard} ${isClick ? styles.isClick : ""}`}
    >
      <div className={isClick ? styles.mainIsClick : styles.main}>
        <div className={styles.top}>
          <div className={styles.name}>
            {isClick ? (
              <div className={styles.nameIsClick}>
                <span
                  className={styles.upIcon}
                  onClick={() => {
                    setIsClick(false);
                  }}
                >
                  <BsChevronUp color="black" size={20} />
                </span>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            ) : (
              <span
                onClick={() => {
                  setIsClick(true);
                }}
              >
                {name}
              </span>
            )}
          </div>
          <div className={styles.topRight}>
            <div className={styles.category}>
              {isClick ? (
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  {categoryData &&
                    categoryData?.category.map((category) => {
                      if (category === "new") return;
                      return (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      );
                    })}
                </select>
              ) : (
                <span>{category}</span>
              )}
            </div>
            <div className={styles.createdAt}>
              {dayjs(product?.createdAt).format("YYYY.MM.DD HH:mm")}
            </div>
            <div className={styles.price}>
              {isClick ? (
                <input
                  value={price ? String(price) : ""}
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");
                    setPrice(Number(value));
                  }}
                />
              ) : (
                price
              )}
            </div>
          </div>
        </div>
        {isClick && (
          <div className={styles.mobilePrice}>
            <label>가격</label>
            <input
              value={price ? String(price) : ""}
              type="text"
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*)\./g, "$1");
                setPrice(Number(value));
              }}
            />
          </div>
        )}
        {isClick && (
          <div className={styles.bottom}>
            <div className={styles.bottomLeft}>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className={styles.textarea}
              ></textarea>
            </div>
            <div className={styles.bottomRight}>
              <div className={styles.list}>
                <div className={styles.listTip}>
                  <p>이미지 파일은 최소 2개 이상으로 설정해주세요.</p>
                </div>
                <div className={styles.imageList}>
                  {img.map((image, index) => (
                    <ImageCard
                      key={`${image}${index}`}
                      index={index}
                      img={img}
                      setImg={setImg}
                    />
                  ))}
                  <div className={styles.addButton}>
                    <button onClick={handleImgButton}>이미지 추가</button>
                  </div>
                </div>

                <div className={styles.listTip}>
                  <p>사이즈는 최소 1개 이상으로 설정해주세요.</p>
                  <p>단일 사이즈인 경우에도 free나 os로 설정</p>
                </div>
                <div className={styles.stockList}>
                  {stock.map((sizeStock, index) => (
                    <StockCard
                      key={`${sizeStock.size}${index}`}
                      index={index}
                      stock={stock}
                      setStock={setStock}
                    />
                  ))}
                  <div className={styles.addButton}>
                    <button onClick={handleStockButton}>사이즈 추가</button>
                  </div>
                </div>
              </div>
              <div className={styles.productCardButton}>
                <div className={styles.isNew}>
                  <select
                    value={isNew ? "신상품" : "신상품x"}
                    onChange={(e) => {
                      setIsNew(e.target.value === "신상품" ? true : false);
                    }}
                  >
                    <option value={"신상품"}>신상품</option>
                    <option value={"신상품x"}>신상품x</option>
                  </select>
                </div>
                <button
                  type="submit"
                  onClick={() => {
                    const check = confirm("정말로 삭제하시겠습니까?");
                    if (check) deleteProductMutate.mutate();
                  }}
                >
                  제품 삭제
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    updateDateMutate.mutate();
                  }}
                >
                  등록일 최신으로
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    updateProductMutate.mutate();
                  }}
                >
                  제품 업데이트
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
