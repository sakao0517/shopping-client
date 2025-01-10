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
  title: `Star Spray`, // 브랜드 이름
  description: `Star Spray`, // 브랜드 이름
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
