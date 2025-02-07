"use client";


import FormSteps from "@/components/form-steps";
import FormStepsTab from "@/components/form-steps-tab";
import { InputCustom } from "@/components/form/input-custom";
import { SelectGroup } from "@/components/form/select-group";
import { FormType, QuestionType } from "@/types/form-type";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";



type FormData = {
  // [key: string]: string | string[];
  steps:any[]

};

export default function FormDisplay() {
  const { handleSubmit,control,reset,setValue } = useForm<FormData>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answerId,setAnswerId] = useState("")
  const [form, setForm] = useState<FormType>({} as FormType);
  const [formName, setFormName] = useState<string>("");
  const params = useParams();

  const { fields,update  } = useFieldArray({
    control,
    name: "steps", 
  });
  console.log('fields',fields);
  
  
  useEffect(() => {
    async function loadForm() {
      const response = await fetch(`http://localhost:3333/forms/${params.id}`);
      const data = await response.json();
      console.log('data',data);
      setForm(data)
      setQuestions(data.questions|| []);
      setFormName(data.name|| "");
      
    }
    loadForm();
  }, [params.id]);

  const onSubmit = useCallback(async(data: FormData) => {
    console.log("Respostas do formulário:", data);
    if(!answerId){
      const response  = await fetch(`http://localhost:3333/answers`,{
        method:'POST',
        body:JSON.stringify({form_id:params.id,answers:data})
      });
      const toJson = await response.json();
      setAnswerId(toJson.id)
      
    }else{
      await fetch(`http://localhost:3333/answers/${answerId}`,{
        method:'PUT',
        body:JSON.stringify({form_id:params.id,...data})
      });
    }
    
    
    
    
    
  },[params.id,answerId]);

  return (
    <div className="w-8/12 mx-auto p-4 shadow-md">
      
      <h1 className="text-2xl font-bold mb-4">{formName || "Formulário"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
  
        {form.id &&<FormStepsTab steps={form.steps} control={control} onNextStep={handleSubmit(onSubmit)} />}
        
       
      </form>
    </div>
  );
}
