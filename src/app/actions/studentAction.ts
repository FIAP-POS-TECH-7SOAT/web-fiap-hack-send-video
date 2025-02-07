"use server";

import { serverAction } from "./serverAction";

export type CreateStudentFormSchema = {
  name: string;
  birthdate: number;
  registration: string;
  doc_number: string;
  icd_id: string;
};

export async function ServerStudents(token: string): Promise<any> {
  async function fetchStudents() {
    const response = await serverAction(
      `${process.env.NEXT_PUBLIC_APP_URL}/student`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if ("status" in response && response.status !== 200) {
      return { error: response.statusText };
    }
    if ("error" in response) {
      return response;
    }
    return response.json();
  }
  const students = await fetchStudents();

  if (!Array.isArray(students)) {
    return [];
  }

  return students.map((student: { class: any }) => ({
    ...student,
    class: student.class?.name || "Not classed",
  }));
}

export async function createStudent(
  data: CreateStudentFormSchema,
  token: string
) {
  const response = await serverAction(
    `${process.env.NEXT_PUBLIC_APP_URL}/student`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        birthdate: data.birthdate,
        registration: data.registration,
        doc_number: data.doc_number,
        icd_id: data.icd_id,
      }),
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

export async function updateStudent<T>(
  studentId: string,
  data: T,
  token: string
) {
  try {
    const response = await serverAction(
      `${process.env.NEXT_PUBLIC_APP_URL}/student/${studentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    if (!response.ok) {
      return response.json().then((errData) => {
        console.log("respoError", errData);
        throw new Error(
          `Error ${response.status}: ${errData.message || "Unknown error"}`
        );
      });
    }
    return result;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}
