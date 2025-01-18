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
  title: `스타스프레이`, // 브랜드 이름
  description: `스타스프레이`, // 브랜드 설명
  other: {
    "google-site-verification": "z51t_yEWb2JkWC3tHdtTJOowpAhKeiiEdLAfcK2kJrk",
    "naver-site-verification": "3e6288a5a45db0b37299ef3b4859b4f466b98192",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
