import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login, me } from "./actions/auth";
// Your own logic for dealing with plaintext password strings; be careful!

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 7200, //2시간
  },
  callbacks: {
    async jwt({ token, user }) {
      const serverUser = await me();
      if (!serverUser) return null;
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: any) {
      session.user.id = token.id;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  pages: {
    signIn: "/account/login",
    newUser: "/account/signup",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        // logic to salt and hash password

        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash)
        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error();
        }
        user = await login(email as string, password as string);
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error();
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
});
