import type { Metadata } from "next";
import "./globals.css";
import ReactQueryClientProvider from "./_config/ReactQueryClientProvider";
import Nav from "./_components/Nav/Nav";
import Footer from "./_components/Footer/Footer";
import AuthSession from "./_config/SessionProvider";
import NavMenu from "./_components/NavMenu/NavMenu";
import SearchMenu from "./_components/SearchMenu/SearchMenu";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: `사카오샵`, // 브랜드 이름, 구글 표시
  description: `다양하고 귀여운 일본소품을 만나보세요!`, // 브랜드 설명, 구글 표시
  other: {
    "google-site-verification": "z51t_yEWb2JkWC3tHdtTJOowpAhKeiiEdLAfcK2kJrk",
    "naver-site-verification": "3e6288a5a45db0b37299ef3b4859b4f466b98192",
    keywords: "사카오,사카오샵,소품,소품샵",
    authors: "SAKAO",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <link rel="icon" href="/images/favicon.ico" sizes="48x48" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/apple-icon.png"
      />
      <body>
        <ReactQueryClientProvider>
          <AuthSession>
            <Nav />
            {children}
            <Footer />
            <SearchMenu />
            <NavMenu />
            <Analytics />
          </AuthSession>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
