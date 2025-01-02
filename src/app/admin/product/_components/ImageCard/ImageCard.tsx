"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./ImageCard.module.css";

export default function ImageCard({
  index,
  img,
  setImg,
}: {
  index: number;
  img: string[];
  setImg: Dispatch<SetStateAction<string[]>>;
}) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [url, setUrl] = useState<string>(img[index]);
  const handleDelete = () => {
    const newImg = img.slice();
    newImg.splice(index, 1);
    setImg(newImg);
  };
  return (
    <div className={styles.imageCard}>
      <div className={styles.image}>
        <img src={url} />
      </div>
      <div className={styles.url}>
        <input
          disabled={!isUpdate}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
      </div>
      <div className={styles.updateButton}>
        {isUpdate ? (
          <button
            onClick={() => {
              const tmpImg = img.slice();
              tmpImg[index] = url;
              setImg(tmpImg);
              setIsUpdate(false);
            }}
          >
            확인
          </button>
        ) : (
          <button
            onClick={() => {
              setIsUpdate(true);
            }}
          >
            수정
          </button>
        )}
      </div>
      <div className={styles.delete}>
        <button onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
}
