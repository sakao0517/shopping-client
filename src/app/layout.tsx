import type { Metadata } from "next";
import "./globals.css";
import ReactQueryClientProvider from "./config/ReactQueryClientProvider";
import Nav from "./_components/Nav/Nav";
import Footer from "./_components/Footer/Footer";
import AuthSession from "./config/SessionProvider";
import NavMenu from "./_components/NavMenu/NavMenu";
import SearchMenu from "./_components/SearchMenu/SearchMenu";

export const metadata: Metadata = {
  title: "Brand Name",
  description: "Brand Name",
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
          </AuthSession>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
