import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

interface UserData {
  id: string;
  name: string;
  email: string;
}
export function useUserSession() {
  const { data: session } = useSession();
  const [fullUserData, setFullUserData] = useState<UserData | null>(null);

  const userData = useMemo(() => {
    if (session?.user.token) {
      const decodedToken = jwtDecode(session.user.token) as { sub: string };
      return { id: decodedToken.sub };
    }
    return null;
  }, [session]);

  const fetchUserData = useCallback(async () => {
    if (userData?.id) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/users/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFullUserData(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }, [userData, session]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { session, userData: fullUserData };
}
