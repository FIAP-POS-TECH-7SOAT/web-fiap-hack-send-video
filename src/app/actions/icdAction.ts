"use server";

import { serverAction } from "./serverAction";

export async function getICDs(token: string) {
  const response = await serverAction(
    `${process.env.NEXT_PUBLIC_APP_URL}/icd`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return response.json().then((errData) => {
      console.log("respoError", errData);
      throw new Error(
        `Error ${response.status}: ${errData.message || "Unknown error"}`
      );
    });
  }

  return response.json();
}
