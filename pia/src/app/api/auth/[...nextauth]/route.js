import util from 'util';
import db from '../../../../util/db';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import fs from 'fs';


const crypto = require('crypto');
const path = require('path')

const query = util.promisify(db.query).bind(db);



export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 5, 
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        let user = await query('SELECT * FROM users WHERE email = ?', [credentials.email]);
        user = user[0];

        if (!user) {
          return null;
        }

        // Compare hashed password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (isValidPassword) {
          return {
            id: user.uniqID,
            name: user.firstName + ' ' + user.lastName, // Combine firstName and lastName
            uniqID: user.uniqID // Include uniqID in the token
          };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.uniqID = user.uniqID;
        token.name = user.name;
      }
      return token; // Ensure token is an object
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.uniqID = token.uniqID;
        session.user.name = token.name;
      }
      return session;

    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
    maxAge: 5
  },


};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
