"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./AdminUserCard.module.css";
import { OrderType, UserType } from "@/type/type";
import { useEffect, useState } from "react";
import { deleteAdminUser, updateAdminUser } from "@/actions/admin";
import OrderCard from "../OrderCard/OrderCard";
import dayjs from "dayjs";
import { BsChevronUp } from "react-icons/bs";
import { mainColor } from "@/app/_config/ColorSetting";

export default function AdminUserCard({ user }: { user: UserType }) {
  const queryClient = useQueryClient();
  const [isClick, setIsClick] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address1, setAddress1] = useState(user.address1);
  const [address2, setAddress2] = useState(user.address2);
  const [zipcode, setZipcode] = useState(user.zipcode);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [newPassword, setNewPassword] = useState("");
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [timeOut, setTimeOut] = useState<any>();
  useEffect(() => {
    setOrders(user.orders);
  }, [user]);

  const updateUserMutate = useMutation({
    mutationFn: async () => {
      if (newPassword) {
        if (newPassword.length < 6 || newPassword.length > 20) {
          alert("비밀번호는 6자 이상 20자 이하로 설정해주세요.");
          return;
        }
      }
      await updateAdminUser(
        user.id,
        name,
        isAdmin,
        phone,
        address1,
        address2,
        zipcode,
        newPassword
      );
    },
    onSuccess: () => {
      clearTimeout(timeOut);
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
      setIsUpdate(true);
      setTimeOut(
        setTimeout(() => {
          setIsUpdate(false);
        }, 500)
      );
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });

  const deleteUserMutate = useMutation({
    mutationFn: async () => {
      await deleteAdminUser(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });

  return (
    <div
      className={`${styles.adminUserCard} ${isClick ? styles.isClick : ""} ${
        isUpdate ? styles.isUpdate : ""
      }`}
    >
      <div className={styles.main}>
        <div className={isClick ? styles.userInfoClick : styles.userInfo}>
          <div className={styles.userInfoLeft}>
            {isClick ? (
              <div className={styles.emailIsClick}>
                <span
                  className={styles.upIcon}
                  onClick={() => {
                    setIsClick(false);
                  }}
                >
                  <BsChevronUp color={`${mainColor}`} size={20} />
                </span>
                <span onClick={() => setIsClick((prev) => !prev)}>
                  {user.email}
                </span>
              </div>
            ) : (
              <span onClick={() => setIsClick((prev) => !prev)}>
                {user.email}
              </span>
            )}
          </div>
          <div className={styles.userInfoRight}>
            <div className={`${styles.rightMenu} ${styles.rightMenuName}`}>
              {name}
            </div>
            <div className={styles.rightMenu}>
              {user?.createdAt
                ? dayjs(user.createdAt).format("YYYY.MM.DD HH:mm")
                : ""}
            </div>
            {isClick ? (
              <div className={`${styles.rightMenu} ${styles.adminSelect}`}>
                <select
                  value={isAdmin ? "어드민o" : "어드민x"}
                  onChange={(e) => setIsAdmin(e.target.value === "어드민o")}
                >
                  <option value="어드민o">어드민o</option>
                  <option value="어드민x">어드민x</option>
                </select>
              </div>
            ) : (
              <div className={`${styles.rightMenu} ${styles.adminSelect}`}>
                {user.isAdmin ? "어드민o" : "어드민x"}
              </div>
            )}
          </div>
        </div>
        {isClick && (
          <div className={styles.userInfoBottom}>
            <div className={styles.userInfoDetail}>
              <div className={styles.detailRow}>
                <label>이름</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={styles.detailRow}>
                <label>휴대전화</label>
                <input
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .replace(/(\..*)\./g, "$1");
                    setPhone(value);
                  }}
                />
              </div>
              <div className={styles.detailRow}>
                <label>우편번호</label>
                <input
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                />
              </div>
              <div className={styles.detailRow}>
                <label>주소</label>
                <input
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className={styles.detailRow}>
                <label>상세주소</label>
                <input
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div className={styles.detailRow}>
                <label>비밀번호</label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="변경시에만 입력"
                />
              </div>
              <div className={styles.orderInfoTip}>
                <p>비밀번호는 6자 이상 20자 이하로 설정해주세요.</p>
                <p>비밀번호를 잘못 입력할 경우 사용자가 로그인 불가능합니다.</p>
              </div>
            </div>
            <div className={styles.orderList}>
              <div className={styles.top}>
                <div className={styles.topOrder}>
                  <span>주문 내역</span>
                </div>
                <div className={styles.topMenu}>
                  <span>주문 상태</span>
                </div>
                <div className={styles.topMenu}>
                  <span>주문 일자</span>
                </div>
                <div className={styles.topMenu}>
                  <span>구매가격</span>
                </div>
              </div>
              {!orders || orders.length === 0 ? (
                <span className={styles.orderNull}>주문내역이 없습니다.</span>
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    setIsUpdate={setIsUpdate}
                    timeOut={timeOut}
                    setTimeOut={setTimeOut}
                  />
                ))
              )}
            </div>
            <div className={styles.userInfoButton}>
              {isClick && (
                <div className={styles.isAdminButton}>
                  <select
                    value={isAdmin ? "어드민o" : "어드민x"}
                    onChange={(e) => setIsAdmin(e.target.value === "어드민o")}
                  >
                    <option value="어드민o">어드민o</option>
                    <option value="어드민x">어드민x</option>
                  </select>
                </div>
              )}
              <button
                onClick={() => {
                  const check = confirm("정말로 삭제하시겠습니까?");
                  if (check) deleteUserMutate.mutate();
                }}
              >
                유저 삭제
              </button>
              <button onClick={() => updateUserMutate.mutate()}>
                유저 업데이트
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
