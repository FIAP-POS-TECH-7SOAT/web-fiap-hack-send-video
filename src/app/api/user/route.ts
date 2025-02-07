import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const body = await request.json();
  
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTHENTICATION_APP_URL}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",  
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();

    return NextResponse.json({ message: data });
  }

  return NextResponse.json(
    { error: `Erro: ${response.statusText}` },
    { status: response.status }
  );
}

