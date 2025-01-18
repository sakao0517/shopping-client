"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./page.module.css";
import { getCartProduct, getUserInfo } from "@/actions/auth";
import { useEffect, useState } from "react";
import { CartProductType, UserType } from "@/type/type";
import OrderCard from "./_components/OrderCard/OrderCard";
import DaumPostcodeEmbed from "react-daum-postcode";
import { BsQuestionCircle, BsX } from "react-icons/bs";
import PortOne from "@portone/browser-sdk/v2";
import { tmpOrder } from "@/actions/order";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { mainColor } from "@/app/_config/ColorSetting";
import Loading from "../_components/Loading/Loading";
import { koreaTimeNow } from "../_config/KoreaTimeNow";

dayjs.locale("ko");

export default function Order() {
  const { data: products, isLoading } = useQuery<CartProductType[]>({
    queryKey: ["cart"],
    queryFn: () => getCartProduct(),
  });
  const { data: userInfo } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [width, setWidth] = useState<number | undefined>();
  const [billing, setBilling] = useState(false);
  const [subtotal, setSubTotal] = useState<number | null>(null);
  const [shipping, setShipping] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [shippingTip, setShippingTip] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [addressModal, setAddressModal] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [scrollY, setScrollY] = useState<number>(0);

  const handleAddressComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    setAddressModal(false);
    setZipcode(data.zonecode);
    setAddress1(fullAddress);
  };
  async function requestPayment() {
    const tmpOrderId = dayjs(koreaTimeNow()).format(`YYMMDDHHmm`);
    const random = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos =
      userAgent.indexOf("iphone") > -1 ||
      (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
    if (isIos) setBilling(false);
    else setBilling(true);

    const orderId = tmpOrderId + random;
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    if (!products) return setBilling(false);
    if (!userInfo) return setBilling(false);
    if (!name || !phone || !address1 || !address2 || !zipcode) {
      setBilling(false);
      return setMessage("주문정보를 정확히 입력해 주세요.");
    }
    if (products?.length === 0) return setBilling(false);
    if (subtotal == null || shipping == null || total == null)
      return setBilling(false);
    try {
      await tmpOrder({
        userId: userInfo?.id,
        orderId,
        shipping: shipping,
        subtotal: subtotal,
        amount: total,
        orderName: "스타스프레이", // 브랜드 이름
        email: userInfo?.email,
        name,
        phone,
        address1,
        address2,
        zipcode,
        cart: products,
      });
    } catch (error: any) {
      if (error.digest === "get product error") {
        setMessage(
          "현재 존재하지 않거나 변경된 상품 사이즈가 포함되어 있습니다."
        );
        return setBilling(false);
      } else if (error.digest === "get product size error") {
        setMessage(
          "현재 존재하지 않거나 변경된 상품 사이즈가 포함되어 있습니다."
        );
        return setBilling(false);
      } else if (error.digest === "sold out") {
        setMessage("현재 품절된 상품이 포함되어 있습니다.");
        return setBilling(false);
      } else if (error.digest === "not enough qty") {
        setMessage(
          "상품의 수량이 재고수량 보다 많은 상품이 포함되어 있습니다."
        );
        return setBilling(false);
      } else if (error.digest) {
        setMessage(error.digest);
        return setBilling(false);
      } else {
        setMessage("문제가 발생했습니다. 다시 시도하세요.");
        return setBilling(false);
      }
    }
    if (
      !process.env.NEXT_PUBLIC_STORE_ID ||
      !process.env.NEXT_PUBLIC_CHANNEL_KEY
    )
      return setBilling(false);

    const payment = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_STORE_ID,
      channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
      paymentId: orderId,
      orderName: "스타스프레이", //브랜드 이름
      totalAmount: total,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      redirectUrl: window.location.origin + `/order/success`,
      customer: {
        fullName: name,
        phoneNumber: phone,
        email: userInfo?.email,
        address: {
          addressLine1: address1,
          addressLine2: address2,
        },
        zipcode: zipcode,
      },
    });
    console.log(payment);
    if (!payment) return;
    if (payment.code !== undefined) {
      setBilling(false);
      return router.push("/order/fail");
    }
    setBilling(false);
    return router.push(`/order/success?paymentId=${payment.paymentId}`);
  }
  useEffect(() => {
    if (!userInfo) return;
    setName(userInfo?.name);
    setPhone(userInfo?.phone);
    setZipcode(userInfo?.zipcode);
    setAddress1(userInfo?.address1);
    setAddress2(userInfo?.address2);
  }, [userInfo]);
  useEffect(() => {
    if (!products || products.length === 0) return;
    let cal: number = 0;
    products.forEach((product: CartProductType) => {
      cal += Number(product.price) * Number(product.cartStock.stock.qty);
    });
    setSubTotal(cal);
  }, [products]);
  useEffect(() => {
    if (subtotal == null) return;
    if (subtotal >= 100000) setShipping(0);
    else setShipping(4000);
  }, [subtotal, products]);
  useEffect(() => {
    if (subtotal == null || shipping == null) return;
    setTotal(subtotal + shipping);
  }, [shipping, subtotal, products]);

  useEffect(() => {
    const body: HTMLBodyElement =
      window.document.getElementsByTagName("body")[0];
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos =
      userAgent.indexOf("iphone") > -1 ||
      (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
    if (billing) {
      if (isIos) {
        const tmpScrollY = window.scrollY;
        setScrollY(tmpScrollY);
        body.style.position = "fixed";
        body.style.top = `-${tmpScrollY}px`;
      } else {
        body.style.overflow = "hidden";
      }
    } else {
      if (isIos) {
        body.style.removeProperty("position");
        body.style.removeProperty("top");
        window.scrollTo(0, scrollY);
      } else {
        body.style.removeProperty("overflow");
      }
    }
  }, [billing]);
  useEffect(() => {
    if (!isLoading) {
      if (!products || products?.length === 0) {
        return router.back();
      }
    }
  }, [products, isLoading]);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const body: HTMLBodyElement =
      window.document.getElementsByTagName("body")[0];
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos =
      userAgent.indexOf("iphone") > -1 ||
      (userAgent.indexOf("ipad") > -1 && "ontouchend" in document);
    if (addressModal) {
      if (window.innerWidth <= 767) {
        if (isIos) {
          const tmpScrollY = window.scrollY;
          setScrollY(tmpScrollY);
          body.style.position = "fixed";
          body.style.top = `-${tmpScrollY}px`;
        } else {
          body.style.overflow = "hidden";
        }
      }
    } else {
      if (isIos) {
        body.style.removeProperty("position");
        body.style.removeProperty("top");
        window.scrollTo(0, scrollY);
      } else {
        body.style.removeProperty("overflow");
      }
    }
  }, [addressModal]);

  if (isLoading) return <Loading />;
  return (
    <div className={styles.order}>
      <div className={styles.yourOrder}>
        <span>Your Order</span>
      </div>
      <div className={styles.main}>
        <div className={styles.maintop_productInfo}>
          <span className={styles.mainTopProduct}>상품 정보</span>
          <span className={styles.mainTopPrice}>가격</span>
          <span className={styles.mainTopQty}>수량</span>
          <span className={styles.mainTopTotal}>총 가격</span>
        </div>
        {products &&
          products.map((product: CartProductType, index: number) => (
            <OrderCard product={product} key={index} />
          ))}
      </div>
      <div className={styles.main}>
        <div className={styles.maintop}>
          <span className={styles.mainTopOrder}>주문 정보</span>
        </div>
        <div className={styles.mainCenter}>
          <div>
            <label>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label>휴대전화</label>
            <input
              required
              maxLength={11}
              placeholder="Phone"
              value={phone}
              type="text"
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*)\./g, "$1");
                setPhone(value);
              }}
            />
          </div>
          <div>
            <label>이메일</label>
            <span>{userInfo?.email}</span>
          </div>
          {zipcode ? (
            <>
              <div>
                <label>우편번호</label>
                <span
                  onClick={() => {
                    setAddressModal(true);
                  }}
                  className={styles.zipcode}
                >
                  {zipcode}
                </span>
              </div>

              <div>
                <label>주소</label>
                <span className={styles.address1}>{address1}</span>
              </div>
              <div>
                <label>상세주소</label>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => {
                    setAddress2(e.target.value);
                  }}
                />
              </div>
            </>
          ) : (
            <div>
              <label>우편번호</label>
              <span
                className={styles.nullZipcode}
                onClick={() => {
                  setAddressModal(true);
                }}
              >
                검색
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.total}>
        <div className={styles.totalMain}>
          <div className={styles.totalMenu}>
            <span>상품합계 금액</span>
            {subtotal && <span>{`₩${subtotal == null ? "" : subtotal}`}</span>}
          </div>
          <div className={styles.shipping}>
            <div className={styles.shippingMain}>
              <span>배송비</span>
              <BsQuestionCircle
                color={`${mainColor}`}
                size={12}
                className={styles.shippingIcon}
                onClick={() => {
                  setShippingTip((prev) => !prev);
                }}
              />
            </div>
            {shipping && <span>{`₩${shipping == null ? "" : shipping}`}</span>}
          </div>
          {shippingTip && (
            <div className={styles.totalMenu}>
              <span className={styles.shippingTip}>
                주문금액이 10만원 미만일 경우 배송비 4,000원이 추가 됩니다.
              </span>
            </div>
          )}
          <div className={styles.totalMenu}>
            <span>총 결제 금액</span>
            {total && <span>{`₩${total == null ? "" : total}`}</span>}
          </div>
        </div>
      </div>
      <div className={styles.checkOut}>
        <button className={styles.button} onClick={() => requestPayment()}>
          결제하기
        </button>
        {message && <span className={styles.message}>{message}</span>}
      </div>
      {addressModal && (
        <div className={styles.addressModal}>
          <DaumPostcodeEmbed
            style={{
              width: `${
                width !== undefined
                  ? width > 767
                    ? "496px"
                    : "100vw"
                  : "496px"
              }`,
              height: `${
                width !== undefined
                  ? width > 767
                    ? "444px"
                    : "100svh"
                  : "444px"
              }`,
            }}
            onComplete={handleAddressComplete}
          />
          <BsX
            size={width !== undefined ? (width > 767 ? "24" : "28") : "24"}
            color={`${mainColor}`}
            onClick={() => {
              setAddressModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
