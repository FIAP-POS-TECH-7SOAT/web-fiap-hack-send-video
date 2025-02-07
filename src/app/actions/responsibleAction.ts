"use server";

import { serverAction } from "./serverAction";
import { revalidateTag } from "next/cache";

export type ResponsibleFormData = {
  name: string;
  doc_number: string;
  hasAccessAsUser: boolean;
  affiliation: string;
  phone: string;
  email: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getResponsiblesByStudentId(
  studentId: string,
  token: string
): Promise<any> {
  const response = await serverAction(
    `${process.env.NEXT_PUBLIC_APP_URL}/student/${studentId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["responsibles"] },
    }
  );

  if (response.status === 429) {
    await wait(2000);
    return getResponsiblesByStudentId(studentId, token);
  }

  if (!response.ok) {
    return response.json().then((errData) => {
      console.log("respoError", errData);
      throw new Error(
        `Error ${response.status}: ${errData.message || "Unknown error"}`
      );
    });
  }

  const data = await response.json();
  return data.responsable;
}

export async function createResponsible(
  data: ResponsibleFormData,
  studentId: string,
  token: string
) {
  const response = await serverAction(
    `${process.env.NEXT_PUBLIC_APP_URL}/responsable/student/${studentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        doc_number: data.doc_number,
        hasAccessAsUser: data.hasAccessAsUser,
        affiliation: data.affiliation,
        phone: data.phone,
        email: data.email,
      }),
    }
  );

  if (response.ok) {
    revalidateTag("responsibles");
    return await response.json();
  }

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

export async function updateResponsible(
  data: ResponsibleFormData,
  responsibleId: string,
  token: string
) {
  const response = await serverAction(
    `${process.env.NEXT_PUBLIC_APP_URL}/responsable/${responsibleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        doc_number: data.doc_number,
        hasAccessAsUser: data.hasAccessAsUser,
        affiliation: data.affiliation,
        phone: data.phone,
        email: data.email,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = text ? JSON.parse(text) : { message: "Unknown error" };
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    } catch {
      throw new Error(
        `Error ${response.status}: Failed to parse error response`
      );
    }
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { success: true };
}

export async function deleteResponsible(
  responsibleId: string,
  studentId: string,
  token: string
) {
  const response = await serverAction(
    `${process.env.NEXT_PUBLIC_APP_URL}/responsable/${responsibleId}/student/${studentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      error: errorData.message || "Unknown error",
      status: response.status,
    };
  }

  return {
    success: true,
    status: response.status,
  };
}
