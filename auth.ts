import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      async profile(profile) {
        return { ...profile };
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const data = {
          email: credentials?.email,
          password: credentials?.password,
        };

        // logic to verify if the user exists
        const user = await axios.post("http://localhost:5000/login", data);
        const userData = user?.data;

        if (!userData) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }

        // return user object with their profile data
        return userData;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname !== "/") {
        // Only redirect to dashboard if not on the root path
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      console.log({ token });
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        // token.picture = user?.image
      }

      return { ...token, ...user };
    },
    session({ session, token }) {
      console.log({ ...session });
      session.user = {
        ...session.user,
        accessToken: token.accessToken as string,
        name: token.name as string,
        email: token.email as string,
        // image: token.image as string | undefined,
        // image: token.image || token.picture || session.user.image || undefined,
        image:
          typeof token.image === "string"
            ? token.image
            : typeof token.picture === "string"
            ? token.picture
            : session.user.image || undefined,
      };

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
