"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/type/type";
import { getAdminUser } from "@/actions/admin";
import AdminUserCard from "./_components/AdminUserCard/AdminUserCard";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/actions/auth";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { mainColor } from "@/app/_config/ColorSetting";
import Loading from "@/app/_components/Loading/Loading";

interface UserResponse {
  users: UserType[];
  totalLength: number;
}

export default function Auth() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [searchFilter, setSearchFilter] = useState("email");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("createdAt");
  const [options, setOptions] = useState("?createdAt=-1");
  const [nameFilter, setNameFilter] = useState("오름차순");
  const [createdAtFilter, setCreatedAtFilter] = useState("최신순");
  const [isAdminFilter, setIsAdminFilter] = useState("어드민o");
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserType>({
    queryKey: ["account"],
    queryFn: () => getUserInfo(),
  });

  const { data: usersResponse } = useQuery<UserResponse>({
    queryKey: ["admin", "user", options],
    queryFn: () => getAdminUser(options),
  });

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (search) {
      searchParams.set("q", search);
      searchParams.set("searchFilter", searchFilter);
    }

    if (filter === "name") {
      if (nameFilter === "오름차순") {
        searchParams.set("name", "1");
      } else {
        searchParams.set("name", "-1");
      }
    } else if (filter === "createdAt") {
      if (createdAtFilter === "최신순") {
        searchParams.set("createdAt", "-1");
      } else {
        searchParams.set("createdAt", "1");
      }
    } else if (filter === "isAdmin") {
      if (isAdminFilter === "어드민o") {
        searchParams.set("isAdmin", "-1");
      } else {
        searchParams.set("isAdmin", "1");
      }
    }
    searchParams.set("page", "1");
    setOptions(`?${searchParams.toString()}`);
    setCurrentPage(1);
  }, [filter, nameFilter, createdAtFilter, isAdminFilter]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(options);
    searchParams.set("q", search);
    searchParams.set("searchFilter", searchFilter);
    searchParams.set("page", "1");
    setOptions(`?${searchParams.toString()}`);
    setCurrentPage(1);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(options);
    searchParams.set("page", String(currentPage));
    setOptions(`?${searchParams.toString()}`);
  }, [currentPage]);

  useEffect(() => {
    if (isError) router.push("/");
    if (!isLoading) {
      if (userInfo?.isAdmin === true) setUserIsAdmin(true);
      else router.push("/");
    }
  }, [userInfo, isLoading, isError]);

  useEffect(() => {
    if (!usersResponse) return;
    setMaxPage(Math.ceil(usersResponse.totalLength / 10));
  }, [usersResponse]);

  if (isLoading) return <Loading />;
  if (!userIsAdmin) return <div className={styles.auth}></div>;

  return (
    <div className={styles.auth}>
      <div className={styles.main}>
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.searchSelect}>
            <select
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
            >
              <option value={"email"}>이메일</option>
              <option value={"name"}>이름</option>
              <option value={"phone"}>휴대전화</option>
            </select>
          </div>
          <div className={styles.searchInput}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className={styles.searchButton}>
            <button>검색</button>
          </div>
        </form>
        <div className={styles.top}>
          <div className={styles.topUser}>
            <span>사용자</span>
          </div>
          <div
            className={`${styles.topMenu} ${styles.topName} ${
              filter === "name" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("name");
              }}
            >
              이름
            </span>
            <select
              value={nameFilter}
              onChange={(e) => {
                setNameFilter(e.target.value);
              }}
            >
              <option value={"오름차순"}>오름차순</option>
              <option value={"내림차순"}>내림차순</option>
            </select>
          </div>
          <div
            className={`${styles.topMenu} ${
              filter === "createdAt" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("createdAt");
              }}
            >
              등록일
            </span>
            <select
              value={createdAtFilter}
              onChange={(e) => {
                setCreatedAtFilter(e.target.value);
              }}
            >
              <option value={"최신순"}>최신순</option>
              <option value={"오래된순"}>오래된순</option>
            </select>
          </div>
          <div
            className={`${styles.topMenu} ${styles.topAdmin} ${
              filter === "isAdmin" ? `${styles.selected}` : ""
            }`}
          >
            <span
              onClick={() => {
                setFilter("isAdmin");
              }}
            >
              어드민
            </span>
            <select
              value={isAdminFilter}
              onChange={(e) => {
                setIsAdminFilter(e.target.value);
              }}
            >
              <option value={"어드민o"}>어드민o</option>
              <option value={"어드민x"}>어드민x</option>
            </select>
          </div>
        </div>
        <div className={styles.center}>
          {usersResponse?.users.map((user) => (
            <AdminUserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
      <div className={styles.page}>
        {currentPage > 10 && (
          <span
            className={styles.arrow}
            onClick={() => {
              const prevFirstPage = Math.floor((currentPage - 1) / 10) * 10 - 9;
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
    </div>
  );
}
