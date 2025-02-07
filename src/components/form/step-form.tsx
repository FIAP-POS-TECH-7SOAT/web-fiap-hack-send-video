

"use client";

import { IoIosRemoveCircleOutline } from "react-icons/io";

import { ButtonCustom } from "@/components/form/button-custom";
import {Divider} from "@nextui-org/divider";
import { InputCustom } from "@/components/form/input-custom";
import { SelectRadioGroup } from "@/components/form/select-group/select-radio-group";
import { TextAreaCustom } from "@/components/form/text-area-custom";
import { useCallback, useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { useParams } from "next/navigation";
import { FormInput, FormType } from "@/types/form-type";



function QuestionItem({nameRef,control,selectedAnswerType}:any){
  return (<div className="flex flex-col gap-y-4	py-4 px-2">
    <div className="flex">
      <div className="mr-4">
        <InputCustom name={`${nameRef}.field_name`} control={control} label="Nome do campo" />
      </div>
      <div className="flex-1">
        <InputCustom  name={`${nameRef}.question`} control={control} label="Digite a pergunta" />
      </div>
    </div>
        <SelectRadioGroup
          name={`${nameRef}.answer_type`}
          control={control}
          label="Tipo de resposta"
          values={[
            { value: "free-text", title: "Texto livre" },
            { value: "select", title: "Seleção única" },
            { value: "select-multiple", title: "Seleção múltipla" },
          ]}
        />
        {["select-multiple", "select"].includes(selectedAnswerType) && (
         
           <TextAreaCustom
             
             name={`${nameRef}.options`}
             control={control}
             label="Digite as opções separadas por vírgula"
             
           />
         
        )}</div>)
}


export default function FormUpdate() {
  
  const params = useParams();
  const isNew = params.id === 'new'
  const { handleSubmit, control, watch,reset} = useForm<FormInput>();
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "form", 
  });

  useEffect(() => {
    async function load() {
      if (!isNew) {
        const response = await fetch(`http://localhost:3333/forms/${params.id}`, {
          method: "GET",
        });
        const toJson = (await response.json()) as FormType;
  
     
        const defaultValues = toJson.questions.map((item) => ({
          answer_type: item.type,
          field_name:item.field_name,
          options: item.options?.map((op) => op.title).join(",") || "",
          question: item.question,
        }));
        reset({ form:defaultValues  });
      }
    }
  
    load();
  }, [append, fields.length, isNew, params.id, reset]);

  const handleUpdateQuestion = useCallback(
    async (data: FormInput) => {
     
    const body = data.form.map(item=>({
      question: item.question,
      field_name:item.field_name,

      type: item.answer_type,
      multiple: item.answer_type ==='select-multiple',
      options: item.options.split(',').map(op=>({
        title: op, value: v4() 
      }))
    }))
    await fetch(`http://localhost:3333/forms/${params.id}`,{
      method:'PUT',
      body:JSON.stringify({questions:body,name:titleRef.current?.innerHTML})
    })
    
    },
    [params.id]
  );
  const handleSaveQuestion = useCallback(
    async (data: FormInput) => {
    const body = data.form.map(item=>({
      question: item.question,
      field_name:item.field_name,
      type: item.answer_type,
      multiple: item.answer_type ==='select-multiple',
      options: item.options.split(',').map(op=>({
        title: op, value: v4() 
      }))
    }))
    
    await fetch('http://localhost:3333/forms',{
      method:'POST',
      body:JSON.stringify({questions:body,name:titleRef.current?.innerHTML})
    })
    
    },
    []
  );
  
  return (
    <div className="w-8/12 mx-auto p-4  shadow-md">
      <h1 ref={titleRef} className="text-2xl font-bold mb-4" contentEditable>Crie seu formulário</h1>
      <form onSubmit={handleSubmit(isNew ? handleSaveQuestion:handleUpdateQuestion)}>
      <div className="flex flex-col gap-y-6	">
      {fields.map((field, index) => (
       
          <div key={field.id} className="flex items-start border-l-4 border-zinc-400 pl-2">
            
            <div className="flex-1 mr-2">
              <QuestionItem nameRef={`form.${index}`} key={field.id} control={control} selectedAnswerType={watch(`form.${index}.answer_type` as any)}/>
            </div>
            <ButtonCustom type="button" onClick={() => remove(index)} isIconOnly className="bg-transparent" >
              <IoIosRemoveCircleOutline size={30} className="text-red-600"/>
            </ButtonCustom>
          </div>
    
        ))
      }
      </div>
    
        <Divider className="mt-4"/>
        <div className="flex gap-4 mt-4">
        <ButtonCustom
        type="button"
        onClick={() => append({ question: "",answer_type:'free-text',options:'',field_name:"" })}
      >
        Adicionar Pergunta
      </ButtonCustom>
        <ButtonCustom type="submit">Finalizar</ButtonCustom>
        </div>
      </form>
      
    </div>
  );
}
