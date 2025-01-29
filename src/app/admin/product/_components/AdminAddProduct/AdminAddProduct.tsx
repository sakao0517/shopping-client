"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./AdminAddProduct.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import { CategoryType, Stock } from "@/type/type";
import StockCard from "../StockCard/StockCard";
import ImageCard from "../ImageCard/ImageCard";
import { addAdminProduct } from "@/actions/admin";
import { getCategory } from "@/actions/category";
import { koreaTimeNow } from "@/app/_config/KoreaTimeNow";

dayjs.locale("ko");

export default function AdminAddProduct() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("name");
  const [price, setPrice] = useState(99999);
  const [description, setDescription] = useState("descriptioin");
  const [stock, setStock] = useState<Stock[]>([]);
  const [img, setImg] = useState<string[]>([]);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [createdAt, setCreatedAt] = useState(
    dayjs(koreaTimeNow()).format("YYYY-MM-DDTHH:mm:ss")
  );
  const { data: categoryData } = useQuery<CategoryType>({
    queryKey: ["category"],
    queryFn: () => getCategory(),
  });
  const [category, setCategory] = useState("x");
  const handleStockButton = () => {
    const newStock = stock.slice();
    newStock.push({ size: "size", qty: 0 });
    setStock(newStock);
  };
  const handleImgButton = () => {
    const newImg = img.slice();
    newImg.push(
      "https://res.cloudinary.com/hoyahoya/image/upload/v1702882191/letter/tile_vkvmea.png"
    );
    setImg(newImg);
  };
  const addProductMutate = useMutation({
    mutationFn: async () => {
      console.log("dd", category);
      if (
        !name ||
        !price ||
        !category ||
        !img ||
        !stock ||
        !description ||
        !createdAt
      )
        return alert("상품 정보를 입력하세요.");
      if (img.length < 2) return alert("이미지는 최소 2개 이상이어야 합니다.");
      if (stock.length < 1)
        return alert("사이즈는 최소 1개 이상이어야 합니다.");
      await addAdminProduct(
        name,
        price,
        category,
        img,
        stock,
        description,
        createdAt,
        isNew,
        isVisible
      );
    },
    onSuccess: () => {
      setName("name");
      setCategory("x");
      setPrice(99999);
      setDescription("description");
      setStock([]);
      setImg([]);
      setCreatedAt(dayjs(koreaTimeNow()).format("YYYY-MM-DDTHH:mm:ss"));
      queryClient.invalidateQueries({
        queryKey: ["admin", "collections"],
      });
      setIsNew(true);
      setIsVisible(false);
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });

  return (
    <div className={styles.adminAddProduct}>
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.name}>
            <div className={styles.nameIsClick}>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={styles.topRight}>
            <div className={styles.category}>
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
            </div>
            <div className={styles.createdAt}>{createdAt}</div>
            <div className={styles.price}>
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
          </div>
        </div>
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
              <div className={styles.addButton}>
                <button onClick={handleImgButton}>이미지 추가</button>
              </div>
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
              </div>
              <div className={styles.addButton}>
                <button onClick={handleStockButton}>사이즈 추가</button>
              </div>
              <div className={styles.listTip}>
                <p>카테고리가 중복되지 않게 주의해 주세요.</p>
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
              </div>
            </div>
            <div className={styles.productCardButton}>
              <div className={styles.buttonMain}>
                <div className={styles.buttonSelect}>
                  <select
                    value={isNew ? "신상품o" : "신상품x"}
                    onChange={(e) => {
                      setIsNew(e.target.value === "신상품o" ? true : false);
                    }}
                  >
                    <option value={"신상품o"}>신상품o</option>
                    <option value={"신상품x"}>신상품x</option>
                  </select>
                </div>
                <div className={styles.buttonSelect}>
                  <select
                    value={isVisible ? "숨기기o" : "숨기기x"}
                    onChange={(e) => {
                      setIsVisible(e.target.value === "숨기기o" ? true : false);
                    }}
                  >
                    <option value={"숨기기o"}>숨기기o</option>
                    <option value={"숨기기x"}>숨기기x</option>
                  </select>
                </div>
              </div>
              <div className={styles.buttonMain}>
                <button
                  type="submit"
                  onClick={() => {
                    addProductMutate.mutate();
                  }}
                >
                  상품 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
