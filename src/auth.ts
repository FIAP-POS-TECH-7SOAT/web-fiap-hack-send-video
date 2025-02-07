import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
interface User {
  id: string;
  email: string;
  name?: string;
  token: string;
}
type JWTDecoded={
  user_email:string;
  phone:string;
  sub:string
}
export function getAuthToken(req?: Request) {
  if (req) {
    
    const cookieStore = cookies();
    const token = cookieStore.get("authToken")?.value;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        return token;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }
  return null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    
    
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        
        
        
        if (!credentials) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_AUTHENTICATION_APP_URL}/auth/check`,
            {
              method: "POST",
              body: JSON.stringify({
                user_email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          
          
          if (!response.ok) {
            const aaa=await response.json()
            console.log('error',aaa);
            
            return null;
          }
          
          const authData = await response.json();
          
          
          
          if (!authData.token) {
            return null;
          }
          const decodedToken = jwtDecode<JWTDecoded>(authData.token);
          
          return {
            id: decodedToken.sub,
            email: decodedToken.user_email,
            name: 'Fake Name',
            token: authData.token,
          } as User;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
  
      return !!auth;
    },
    session: async ({ session, token }) => {
      
      if (token && typeof token.access_token === "string") {
        session.user = {
          ...session.user,
          token: token.access_token,
        };
      }
      return session;
    },
    jwt: ({ token, user }) => {
      
      if (user) {
        token.access_token = user.token;
      }
      return token;
    },
   
  },
  secret: process.env.AUTH_SECRET,
});
