//src/server/auth.ts

import {
    getServerSession,
    type NextAuthOptions,
  } from "next-auth";
  import Credentials from 'next-auth/providers/credentials';
  import { userService } from "./services/userService";
  
  export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt", //(1)
      maxAge: 3600
    },
    callbacks: {
      async jwt({ token, account, profile }) { 
        if(account && account.type === "credentials") { //(2)
          token.userId = account.providerAccountId; // this is Id that coming from authorize() callback 
        }
        return token;
      },
      async session({ session, token, user }) { 
        session.user.id = token.userId; //(3)
        return session;
      },
    },
    pages: {
      signIn: '/login', //(4) custom signin page path
    },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "email@example.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
           const { email, password } = credentials as {
            email: string
            password: string
           };
  
          return userService.authenticate(email, password); //(5) 
        }
      })
    ],
  };
  
  export const getServerAuthSession = () => getServerSession(authOptions); //(6) 