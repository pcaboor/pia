import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    uniqID?: string; 
  }

  interface Session {
    user: User;
  }
}
