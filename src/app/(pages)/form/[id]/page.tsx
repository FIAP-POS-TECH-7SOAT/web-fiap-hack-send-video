"use client"
import React, { useCallback, useEffect } from "react";
import { useForm,  useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardBody } from "@nextui-org/react";
import { InputCustom } from "@/components/form/input-custom";
import { v4 } from "uuid";
import { FormInput, FormInputItem, FormInputStep } from "@/types/form-type";

import FormStepsTabV2 from "@/components/form-steps-tab-v2";

import { useParams } from "next/navigation";
import z from 'zod';

const schema = z.object({
  name: z.string(),
  gender: z.string(),
  colors:z.string(),

  salary: z.string(),
  finance: z.string(),
})



export default function FormBuilder({defaultValues}:any) {
  const params = useParams();
  const isNew = params.id === 'new'

  const { control, handleSubmit, getValues,watch,reset,setValue } = useForm<FormInput>({

  defaultValues:defaultValues??{form:[{
    id:v4(),
    name:"",
    validations:{},
    steps:[],
  }]}
  });

  const { fields,update  } = useFieldArray({
    control,
    name: "form", 
  });

  // Add a new step
  const addStep = (formIndex:number) => {
    const myForm = getValues('form')[formIndex];
    const steps  = myForm.steps
    const newStep: FormInputStep = {
      id:v4(),
      step_number: String(steps.length + 1),
      title: `Novo Passo`,
      questions: [],
    };
    steps.push(newStep)
    update(formIndex,{
      steps,
      id:myForm.id,
      name:myForm.name
    })
    
    
  };

  // Add a new question to a step
  const addQuestion = (formIndex:number,stepIndex: number) => {

    const myForm = getValues('form')[formIndex];
    const steps  = myForm.steps
    const newQuestion: FormInputItem = {
      answer_type:'free-text',
      field_name:"",
      options:"",
      question:""
    };
    steps[stepIndex].questions.push(newQuestion)
    update(formIndex,{
      steps,
      id:myForm.id,
      name:myForm.name
    })


  };

  // // Remove a step
  const removeStep = (formIndex:number,stepIndex: number) => {
    const myForm = getValues('form')[formIndex];
    const steps  = myForm.steps

    steps.splice(stepIndex,1)
    update(formIndex,{
      steps,
      id:myForm.id,
      name:myForm.name
      
    })
  };

  // // Remove a question
  const removeQuestion = (formIndex: number,stepIndex: number, questionIndex: number) => {
    const myForm = getValues('form')[formIndex];
    const steps  = myForm.steps

    steps[stepIndex].questions.splice(questionIndex,1)
    update(formIndex,{
      steps,
      id:myForm.id,
      name:myForm.name
    })

  };

  
  const handleUpdateQuestion = useCallback(
    async (data: any) => {
     

    await fetch(`http://localhost:3333/forms/${params.id}`,{
      method:'PUT',
      body:JSON.stringify(data)
    })
    
    },
    [params.id]
  );
  const handleSaveQuestion = useCallback(
    async (data: any) => {
    
    
    await fetch('http://localhost:3333/forms',{
      method:'POST',
      body:JSON.stringify(data)
    })
    
    },
    []
  );
  const onSubmit = async(data: FormInput) => {
    console.log('data',data);
 
    const body = data.form.map(item=>({
      id:item.id,
      name:item.name,
      validations:item.validations,
      steps:item.steps.map(step=>({
        id:step.id,
        step_number:step.step_number,
        title:step.title,
        questions:step.questions.map(question=>({
          question: question.question,
          field_name:question.field_name,
          type: question.answer_type,
          multiple: question.answer_type ==='select-multiple',
          options: question.options.split(',').map(op=>({
            title: op, 
            value: v4() 
          }))
        })),
      }))
    }))

    console.log('body',body);
    
    if(isNew){
      await handleSaveQuestion(body[0]);
    }else{
      await handleUpdateQuestion(body[0])
    }
  };

  useEffect(()=>{
    async function load(){
      if(!isNew){

        const response = await fetch(`http://localhost:3333/forms/${params.id}`,{
          method:'GET',
          
        })

        const toJson =await response.json();
        console.log('toJson',toJson);
        
        const defaultValues = {
          id:toJson.id,
          name:toJson.name,
          steps:toJson.steps.map((step:any)=>({
            id:step.id,
            step_number:step.step_number,
            title:step.title,
            questions:step.questions.map((question:any) => ({
              answer_type: question.type,
              field_name:question.field_name,
              options: question.options?.map((op:any) => op.title).join(",") || "",
              question: question.question,
            }))
          }))
        }
        reset({ form:[defaultValues]  });

      }
    }
    load()
  },[isNew, params.id,reset])

  return (
    <div className="w-8/12 mx-auto p-4">

      
      <form onSubmit={handleSubmit(onSubmit)}>

     
        {fields.map((field,fieldIndex)=>(
          <>
            <Card key={field.id} className="mb-3">
            <h1 className="text-3xl font-bold text-center m-6">
              Comece a construir seu Formulário
            </h1>

              <CardBody>
                <InputCustom name={`form[${fieldIndex}].name` as any} control={control} label="Titulo Formulario"/>
              </CardBody>
          
          <CardBody>
            <div className="mb-3">
              <Button onClick={()=>addStep(0)} className="mt-4">
                Adicionar Passo
              </Button>
          
            </div>
            
            </CardBody>
            {!!field.steps.length && <FormStepsTabV2 
                steps={field.steps} 
                control={control} 
                watch={watch} 
                addQuestion={addQuestion} 
                field={field}
                formSetValues={setValue as any}
                removeQuestion={removeQuestion}
                removeStep={removeStep}
              />}
                </Card>
          </>

          ))
        }
       
       <div className="flex justify-end">
          <Button type="submit" className="mt-4" color="success">
            Salvar Formulário
          </Button>
       </div>
      </form>
    </div>
  );
}
