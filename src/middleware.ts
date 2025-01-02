export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/account",
    "/account/order/:path*",
    "/order",
    "/order/success",
    "/admin/:path*",
  ],
};
