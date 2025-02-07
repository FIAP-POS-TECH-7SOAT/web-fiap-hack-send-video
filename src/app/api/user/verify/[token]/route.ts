import { NextApiRequest } from "next";
import { NextResponse } from "next/server";


export async function GET(request: Request,{ params }: { params: { token: string } }) {
 
  
  
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTHENTICATION_APP_URL}/user/verify/${params.token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",  
    },
    
  });

  if (response.ok) {
    

    return NextResponse.json({ message: 'ok' });
  }

  return NextResponse.json(
    { error: `Erro: ` },
    { status: 500 }
  );
}

