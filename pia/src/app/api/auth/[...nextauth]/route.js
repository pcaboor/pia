import util from 'util';
import db from '../../../../utils/db';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt';

const query = util.promisify(db.query).bind(db);

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 3600,
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
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account.provider === 'github') {
        // Récupérer l'email du profil GitHub
        const githubEmail = profile.email;

        // Chercher l'utilisateur correspondant dans la base de données
        let dbUser = await query('SELECT * FROM users WHERE email = ?', [githubEmail]);
        dbUser = dbUser[0];

        // Si l'utilisateur n'existe pas, refuser la connexion
        if (!dbUser) {
          return false;
        }

        // Si l'utilisateur existe, attacher les informations nécessaires au token
        user.id = dbUser.uniqID;
        user.name = dbUser.firstName + ' ' + dbUser.lastName;
        user.uniqID = dbUser.uniqID;
      }

      // Pour d'autres providers, laissez la connexion se poursuivre
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uniqID = user.uniqID;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.uniqID = token.uniqID;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 3600,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
