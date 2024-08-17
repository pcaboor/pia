import util from 'util';
import db from '../../../../util/db';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const query = util.promisify(db.query).bind(db);

export const authOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 // 30 secondes
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                let user = await query(`SELECT * FROM users WHERE email = ?`, [credentials.email]);
                user = user[0];

                if (!user) {
                    return null;
                }
                
                // Comparaison du mot de passe haché
                const isValidPassword = bcrypt.compareSync(credentials.password, user.password);
                if (isValidPassword) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name // si vous avez un champ name dans votre table users
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
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        maxAge: 30 // 30 secondes
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };