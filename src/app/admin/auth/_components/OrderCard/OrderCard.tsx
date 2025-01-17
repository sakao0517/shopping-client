import { CartProductType, OrderType } from "@/type/type";
import styles from "./OrderCard.module.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  deleteAdminOrder,
  updateAdminUserOrder,
} from "@/actions/admin";
import OrderProductCard from "../OrderProductCard/OrderProductCard";
import { BsChevronUp } from "react-icons/bs";
import { mainColor } from "@/app/_config/ColorSetting";
dayjs.locale("ko");

export default function OrderCard({
  order,
  setIsUpdate,
  timeOut,
  setTimeOut,
}: {
  order: OrderType;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  timeOut: NodeJS.Timeout;
  setTimeOut: Dispatch<SetStateAction<NodeJS.Timeout>>;
}) {
  const queryClient = useQueryClient();
  const [isClick, setIsClick] = useState(false);
  const [name, setName] = useState(order.name);
  const [phone, setPhone] = useState(order.phone);
  const [address1, setAddress1] = useState(order.address1);
  const [address2, setAddress2] = useState(order.address2);
  const [zipcode, setZipcode] = useState(order.zipcode);
  const [orderStatus, setOrderStatus] = useState<string>(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber);
  const [isCancel, setIsCancel] = useState(order.isCancel);
  const [cancels, setCancels] = useState(order.cancels);
  const [sortCart, setSortCart] = useState<CartProductType[] | null>(null);
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
  const cancelOrderMutate = useMutation({
    mutationFn: async ({
      cancelAmount,
      cancelReason,
    }: {
      cancelAmount: number;
      cancelReason: string;
    }) => {
      await cancelOrder(order.orderId, cancelAmount, cancelReason);
    },
    onSuccess: () => {
      clearTimeout(timeOut);
      queryClient.invalidateQueries({
        queryKey: ["admin", "order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "user"],
      });
      setIsUpdate(true);
      setTimeOut(
        setTimeout(() => {
          setIsUpdate(false);
        }, 500)
      );
    },
    onError: (error: any) => {
      if (
        error.digest === "get user error" ||
        error.digest === "get order error"
      )
        alert("문제가 발생했습니다. 다시 시도하세요.");
      else if (error.digest) alert(error.digest);
      else alert("문제가 발생했습니다. 다시 시도하세요.");
    },
  });
  useEffect(() => {
    if (!order) return;
    const sortCart = order.cart.sort((a, b) => a.price - b.price);
    setSortCart(sortCart);
  }, [order]);
  useEffect(() => {
    if (!order) return;
    setIsCancel(order.isCancel);
    setCancels(order.cancels);
  }, [order]);
  return (
    <div className={isClick ? styles.orderCardIsClick : styles.orderCard}>
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
                {isCancel && (
                  <div className={styles.detailRow}>
                    <label>취소 내역</label>
                    <div className={styles.cancelList}>
                      {cancels.map((cancel, index) => (
                        <div key={index}>
                          <div className={styles.detailRow}>
                            <label>취소 금액</label>
                            <input
                              value={cancel.cancelAmount}
                              disabled={true}
                            />
                          </div>
                          <div className={styles.detailRow}>
                            <label>취소 사유</label>
                            <input
                              value={cancel.cancelReason}
                              disabled={true}
                            />
                          </div>
                          <div className={styles.detailRow}>
                            <label>취소 일자</label>
                            <input
                              value={dayjs(cancel.createdAt).format(
                                "YYYY.MM.DD HH:mm"
                              )}
                              disabled={true}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    const tmpCancelAmount =
                      prompt("결제 취소 금액을 입력해주세요.");
                    if (tmpCancelAmount == null)
                      return alert("결제 취소 금액을 입력해주세요.");
                    if (isNaN(Number(tmpCancelAmount)))
                      return alert("숫자를 입력해주세요.");
                    if (Number(tmpCancelAmount) === 0)
                      return alert("0원 이상 입력해주세요.");
                    const tmpCancelReason = prompt("취소 사유를 입력해주세요.");
                    if (!tmpCancelReason || tmpCancelReason == null)
                      return alert("취소 사유를 입력해주세요.");
                    cancelOrderMutate.mutate({
                      cancelAmount: Number(tmpCancelAmount),
                      cancelReason: tmpCancelReason,
                    });
                  }}
                >
                  결제 취소
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    const check = confirm(
                      "정말로 삭제하시겠습니까?(유저의 주문정보는 삭제되지 않습니다.)"
                    );
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
