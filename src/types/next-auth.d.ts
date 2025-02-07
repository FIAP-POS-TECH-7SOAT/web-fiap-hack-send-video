import "next-auth";

declare module "next-auth" {
  interface User {
    token: string;
  }

  interface Session {
    user: User & {
      token: string;
    };
  }
}
