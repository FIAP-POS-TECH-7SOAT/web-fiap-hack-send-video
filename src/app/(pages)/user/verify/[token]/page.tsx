"use client"
import React, {  useEffect, useState } from "react";




import { useParams } from "next/navigation";
import z from 'zod';
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import LoadingScreen from "@/components/layout/loadingScreen";



export function SuccessMessage() {
  return (
    <div className="flex items-center p-4 mb-4 text-green-800 bg-green-100 border border-green-300 rounded-lg">
      <CheckCircle className="w-6 h-6 mr-2" />
      <span>Sua conta foi ativada com sucesso!</span>
      <Link className="ml-2 text-blue-800 underline" href={"/login"}> Ir para o login</Link>
    </div>
  );
};

export function ErrorMessage() {
  return (
    <div className="flex items-center p-4 mb-4 text-red-800 bg-red-100 border border-red-300 rounded-lg">
      <XCircle className="w-6 h-6 mr-2" />
      <span>Houve um erro ao ativar sua conta. Contate o suporte</span>
      
    </div>
  );
};


export default function UserVerify() {
  const params = useParams();
  
  const [isError,setIsError] = useState(true)
  const [isLoading,setIsLoading] = useState(false)

  

  useEffect(()=>{
    async function load(){
     try {
      setIsLoading(true)
      const token = params.token;
      console.log('token');
      
      const response = await fetch(
        `/api/user/verify/${token}`,{
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (!response.ok) {
        setIsError(true)
      }else{
        setIsError(false)
      }
     } catch (error) {
      console.log('error',error);
      
      setIsError(true)
     }finally{
      setIsLoading(false)
     }

    }
    load()
  },[params.token])

  return isLoading? <LoadingScreen/> : isError? <ErrorMessage/> :<SuccessMessage/>
}
