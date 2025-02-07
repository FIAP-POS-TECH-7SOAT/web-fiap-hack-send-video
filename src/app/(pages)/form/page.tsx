"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { FormType } from "@/types/form-type";


export default function FormCreate() {
  const [forms,setForms] = useState<FormType[]>([])

  useEffect(()=>{
    async function load() {
      const response = await fetch('http://localhost:3333/forms',{
        method:'GET',
      })
      const toJson = await response.json()
      console.log('response',toJson);  
      setForms(toJson)
    }
    load()
  },[])
  return (
    <div className="w-8/12 mx-auto p-4  shadow-md">
      {forms.map(item=>(
        <Card key={item.id}>
          <CardBody>{item.name}</CardBody>
        </Card>
      ))}
    </div>
  );
}
