"use client";

import LogoutButton from "./_components/LogoutButton/LogoutButton";
import styles from "./page.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, updateProfile } from "@/actions/auth";
import { OrderType, UserType } from "@/type/type";
import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import DaumPostcodeEmbed from "react-daum-postcode";
import OrderCard from "./_components/OrderCard/OrderCard";
import DeleteButton from "./_components/DeleteButton/DeleteButton";
import { mainColor } from "@/app/_config/ColorSetting";
import Loading from "../_components/Loading/Loading";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function Account() {
  const queryClient = useQueryClient();
  const { data: userInfo, isLoading } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });
  const [message, setMessage] = useState("");
  const [width, setWidth] = useState<number | undefined>();
  const [addressModal, setAddressModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [scrollY, setScrollY] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); //order 개수
  const [maxPage, setMaxPage] = useState(1);

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
  const updateProfileMutate = useMutation({
    mutationFn: async () => {
      await updateProfile(
        name,
        phone,
        address1,
        address2,
        zipcode,
        password,
        newPassword
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      setMessage("회원 정보가 변경되었습니다.");
      setPassword("");
      setNewPassword("");
    },
    onError: (error: any) => {
      if (error.digest === "get user error") {
        setMessage("로그인을 다시 한 후에 시도하세요.");
      } else if (error.digest) {
        setMessage(error.digest);
      } else {
        setMessage("문제가 발생했습니다. 다시 시도하세요.");
      }
    },
  });
  const handleSubmit = () => {
    updateProfileMutate.mutate();
  };
  useEffect(() => {
    if (!userInfo) return;
    setName(userInfo?.name);
    setPhone(userInfo?.phone);
    setZipcode(userInfo?.zipcode);
    setAddress1(userInfo?.address1);
    setAddress2(userInfo?.address2);
  }, [userInfo]);
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
  useEffect(() => {
    if (!userInfo) return;
    const totalPages = Math.ceil(userInfo.orders.length / ordersPerPage);
    setMaxPage(totalPages);
  }, [userInfo, ordersPerPage]);

  if (isLoading) return <Loading />;
  return (
    <div className={styles.account}>
      <div className={styles.myAccount}>My Account</div>
      <div className={styles.main}>
        <div className={styles.mainCenter}>
          <div>
            <label>이름</label>
            <input
              required
              maxLength={15}
              placeholder="Name"
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
          <div>
            <label>기존 비밀번호(비밀번호 변경 시 입력)</label>
            <input
              required
              maxLength={20}
              placeholder="Password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(
                  /[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/g,
                  ""
                );
                setPassword(filteredValue);
              }}
            />
          </div>
          <div>
            <label>새 비밀번호</label>
            <input
              required
              maxLength={20}
              placeholder="New Password"
              type="password"
              autoComplete="off"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={styles.updateButton}>
          <button className={styles.button} onClick={handleSubmit}>
            회원정보 수정
          </button>
          {message && <span className={styles.message}>{message}</span>}
        </div>
        <div className={styles.bottom}>
          <LogoutButton />
          <DeleteButton />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.maintop}>
          <span className={styles.mainTopOrder}>주문 내역</span>
          <span className={styles.mainTopDate}>일자</span>
          <span className={styles.mainTopTotal}>가격</span>
        </div>
        {userInfo && userInfo?.orders.length > 0 ? (
          <>
            {userInfo.orders
              .slice(
                (currentPage - 1) * ordersPerPage,
                currentPage * ordersPerPage
              )
              .map((order: OrderType) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            <div className={styles.page}>
              {currentPage > 10 && (
                <span
                  className={styles.arrow}
                  onClick={() => {
                    const prevFirstPage =
                      Math.floor((currentPage - 1) / 10) * 10 - 9;
                    setCurrentPage(prevFirstPage);
                  }}
                >
                  <AiOutlineLeft size={12} color={`${mainColor}`} />
                </span>
              )}
              {Array.from(
                {
                  length: Math.min(
                    10,
                    maxPage - Math.floor((currentPage - 1) / 10) * 10
                  ),
                },
                (v, i) => Math.floor((currentPage - 1) / 10) * 10 + i + 1
              ).map((page) => (
                <span
                  className={page === currentPage ? `${styles.selectPage}` : ``}
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </span>
              ))}
              {Math.floor((currentPage - 1) / 10) * 10 + 10 < maxPage && (
                <span
                  className={styles.arrow}
                  onClick={() => {
                    const nextFirstPage =
                      Math.floor((currentPage - 1) / 10) * 10 + 11;
                    setCurrentPage(nextFirstPage);
                  }}
                >
                  <AiOutlineRight size={12} color={`${mainColor}`} />
                </span>
              )}
            </div>
          </>
        ) : (
          <div className={styles.nullOrder}>주문내역이 없습니다.</div>
        )}
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
