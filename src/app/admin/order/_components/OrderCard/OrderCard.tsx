import { CartProductType, OrderType } from "@/type/type";
import styles from "./OrderCard.module.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminOrder, updateAdminUserOrder } from "@/actions/admin";
import OrderProductCard from "../OrderProductCard/OrderProductCard";
import { BsChevronUp } from "react-icons/bs";
import { mainColor } from "@/app/_config/ColorSetting";
dayjs.locale("ko");

export default function OrderCard({ order }: { order: OrderType }) {
  const queryClient = useQueryClient();
  const [isClick, setIsClick] = useState(false);
  const [name, setName] = useState(order.name);
  const [phone, setPhone] = useState(order.phone);
  const [address1, setAddress1] = useState(order.address1);
  const [address2, setAddress2] = useState(order.address2);
  const [zipcode, setZipcode] = useState(order.zipcode);
  const [orderStatus, setOrderStatus] = useState<string>(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber);
  const [sortCart, setSortCart] = useState<CartProductType[] | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [timeOut, setTimeOut] = useState<any>();
  const updateOrderMutate = useMutation({
    mutationFn: async () => {
      await updateAdminUserOrder({
        name,
        phone,
        address1,
        address2,
        zipcode,
        orderId: order.orderId,
        orderStatus,
        trackingNumber,
      });
    },
    onSuccess: () => {
      clearTimeout(timeOut);
      queryClient.invalidateQueries({
        queryKey: ["admin", "order"],
      });
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
  const deleteOrderMutate = useMutation({
    mutationFn: async () => {
      await deleteAdminOrder(order.orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "order"] });
    },
    onError: () => {
      alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });
  useEffect(() => {
    if (!order) return;
    const sortCart = order.cart.sort((a, b) => a.price - b.price);
    setSortCart(sortCart);
  }, [order]);
  return (
    <div
      className={`${styles.orderCard} ${isClick ? styles.isClick : ""} ${
        isUpdate ? styles.isUpdate : ""
      }`}
    >
      <div className={styles.main}>
        <div className={isClick ? styles.productCardClick : styles.productCard}>
          {sortCart &&
            sortCart.map((product, index) => (
              <OrderProductCard
                cartProduct={product}
                setIsClick={setIsClick}
                key={index}
              />
            ))}
          {isClick && (
            <div className={styles.productCardIsClick}>
              <span
                className={styles.upIcon}
                onClick={() => {
                  setIsClick(false);
                }}
              >
                <BsChevronUp color={`${mainColor}`} size={20} />
              </span>
            </div>
          )}
        </div>
        <div className={isClick ? styles.orderInfoClick : styles.orderInfo}>
          <div className={styles.orderInfoTop}>
            {isClick ? (
              <div className={styles.orderStatusSelect}>
                <select
                  value={orderStatus}
                  onChange={(e) => {
                    setOrderStatus(e.target.value);
                  }}
                >
                  <option value="주문 확인 중">주문 확인 중</option>
                  <option value="발송 준비 중">발송 준비 중</option>
                  <option value="발송 완료">발송 완료</option>
                  <option value="반품 진행 중">반품 진행 중</option>
                  <option value="반품 완료">반품 완료</option>
                </select>
              </div>
            ) : (
              <div className={styles.orderStatus}>{order.orderStatus}</div>
            )}
            <div className={styles.createdAt}>
              {order?.createdAt
                ? dayjs(order.createdAt).format("YYYY.MM.DD HH:mm")
                : ""}
            </div>
            <div className={styles.orderAmount}>{`₩${order.amount}`}</div>
          </div>
          {isClick && (
            <div className={styles.orderInfoBottom}>
              <div className={styles.orderInfoDetail}>
                <div className={styles.detailRow}>
                  <label>주문번호</label>
                  <input value={order.orderId} disabled={true} />
                </div>
                <div className={styles.detailRow}>
                  <label>상품 총 가격</label>
                  <input value={order.subtotal} disabled={true} />
                </div>
                <div className={styles.detailRow}>
                  <label>배송비</label>
                  <input value={order.shipping} disabled={true} />
                </div>
                <div className={styles.detailRow}>
                  <label>주문자 이름</label>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.detailRow}>
                  <label>휴대전화</label>
                  <input
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.detailRow}>
                  <label>이메일</label>
                  <input value={order.email} disabled={true} />
                </div>
                <div className={styles.detailRow}>
                  <label>우편번호</label>
                  <input
                    value={zipcode}
                    onChange={(e) => {
                      setZipcode(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.detailRow}>
                  <label>주소</label>
                  <input
                    value={address1}
                    onChange={(e) => {
                      setAddress1(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.detailRow}>
                  <label>상세주소</label>
                  <input
                    value={address2}
                    onChange={(e) => {
                      setAddress2(e.target.value);
                    }}
                  />
                </div>
                <div className={styles.detailRow}>
                  <label>송장번호</label>
                  <input
                    value={trackingNumber}
                    onChange={(e) => {
                      setTrackingNumber(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={styles.orderInfoTip}>
                <p>송장번호는 택배회사와 송장번호를 같이 입력해주세요.</p>
                <p>{"ex) cj대한통훈 1234567890"}</p>
              </div>
              <div className={styles.orderInfoButton}>
                <button
                  type="submit"
                  onClick={() => {
                    const check = confirm("정말로 삭제하시겠습니까?");
                    if (check) deleteOrderMutate.mutate();
                  }}
                >
                  주문내역 삭제
                </button>
                <button
                  onClick={() => {
                    updateOrderMutate.mutate();
                  }}
                  type="submit"
                >
                  주문내역 변경
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
