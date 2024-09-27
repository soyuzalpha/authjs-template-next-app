import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
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
        image: token.image as string | undefined,
      };

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
