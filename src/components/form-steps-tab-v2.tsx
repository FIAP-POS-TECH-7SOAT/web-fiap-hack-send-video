import { useCallback, useRef, useState } from "react";
import { Accordion, AccordionItem, Button, Card, CardBody, Divider } from "@nextui-org/react";


import { IoIosArrowBack, IoIosArrowForward, IoIosRemoveCircleOutline } from "react-icons/io";
import { BsUiChecksGrid } from "react-icons/bs";

import { FormInputStep } from "@/types/form-type";
import { InputCustom } from "./form/input-custom";
import { ButtonCustom } from "./form/button-custom";
import { SelectRadioGroup } from "./form/select-group/select-radio-group";
import { TextAreaCustom } from "./form/text-area-custom";
import { ButtonEditable } from "./form/button-editable";
import { ZodSchemaBuilder } from "./form/validation-creator";




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

type FormStepTabType={
  steps: FormInputStep[];
  onNextStep?:()=>void
  control:any
  field:any;
  addQuestion:(a:any,b:any)=>void;
  watch:(name:string)=>void
  formSetValues:(name:string,value:string)=>void
  removeQuestion:(fieldIndex:number,activeTab:number,questionIndex:number)=>void
  removeStep:(fieldIndex:number,activeTab:number)=>void
}
export default function FormStepsTabV2({steps,onNextStep,control,field,addQuestion,watch,removeQuestion,removeStep,formSetValues}:FormStepTabType) {

  const [schema, setSchema] = useState<any>({});
  

  const handleCreateSchema = (generatedSchema: any) => {
    setSchema((old: any) => {
      const updatedState = { ...old,...generatedSchema };
      formSetValues('validations',updatedState)
      return updatedState;
    });

  };


  const [activeTab, setActiveTab] = useState(0);
  const [isLast, setIsLast] = useState(false);
  
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 150; // Pixels a serem rolados
      const currentScroll = tabsRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      tabsRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  const handlePreviewStep = useCallback(()=>{
    setActiveTab(old=>{
      let newActive = old-1;
      if(newActive<=0){
        newActive= 0;
      }
      setIsLast(false);

      return newActive;
    });

 
  },[])
  const handleNextStep = useCallback(()=>{
    const stepsAmount = steps.length-1;
    setActiveTab(old=>{
      let newActive = old+1;
      
      if(newActive>= stepsAmount){
        setIsLast(true);
        newActive = stepsAmount;
      }else{
        setIsLast(false);
      }

      return newActive;
    });
    if(onNextStep){
      
      onNextStep()
    }
  },[onNextStep, steps.length])
  const haMany = containerRef.current && tabsRef.current && containerRef.current?.scrollWidth <tabsRef.current?.scrollWidth;

  const fieldIndex = 0;
  return (
    <div className="flex  w-full flex-col" ref={containerRef}>
      <div className="flex flex-col ">
        {
          haMany && 
          <div className="flex mb-3 gap-3">
          
          <Button
            isIconOnly
            radius="full"
            onPress={() => scrollTabs("left")}
            
            variant="flat"
          >
            <IoIosArrowBack />
          </Button>
          <Button
            isIconOnly
            radius="full"
            onPress={() => scrollTabs("right")}
            variant="flat"
          >
            <IoIosArrowForward/>
          </Button>

        </div>
        }
    <CardBody>
        <div
          ref={tabsRef}
          className="flex overflow-x-hidden no-scrollbar scroll-smooth space-x-2"
        >
           
       
          
          {steps.map((item,index) => (
            <> 
              <ButtonEditable 
                key={item.id}
                color={activeTab === index ? "primary" : "default"}
                onPress={() => setActiveTab(index)}
                className="whitespace-nowrap shrink-0" 
                control={control} 
                name={`form[${fieldIndex}].steps[${index}].title`} 
                label="Titulo do passo"
                isAllowToEdit={activeTab === index}
                onDelete={()=>removeStep(0,index)}
              /> 
            </>

          ))}
        </div>
          </CardBody>
      </div>

      

      <Card className="mt-4 p-4">
        <CardBody>
  

              {field.steps[activeTab].questions.map((question:any, questionIndex:any) => (
             
                   <div key={questionIndex} className="mb-4">
            
                     <div key={question.field_name} className="flex items-start border-l-4 border-zinc-400 pl-2">
                      
                      <div className="flex-1 mr-2">
                        <QuestionItem nameRef={`form[${fieldIndex}].steps[${activeTab}].questions[${questionIndex}]`} key={field.id} control={control} selectedAnswerType={watch(`form[${fieldIndex}].steps[${activeTab}].questions[${questionIndex}].answer_type` as any)}/>
                        
                        <Accordion variant="shadow" className="bg-zinc-500">
                          <AccordionItem key="anchor" aria-label="Anchor"  title={<div className="flex items-center"><BsUiChecksGrid className="mr-3" /> Validações</div>} >
                            
                            <ZodSchemaBuilder handleCreateSchema={handleCreateSchema} nameField={question.field_name}  multiple={question.answer_type==='select-multiple'}/>
                          </AccordionItem>
                         

                        </Accordion>
                      </div>
                      <ButtonCustom type="button" isIconOnly className="bg-transparent" >
                        <IoIosRemoveCircleOutline size={30} onClick={()=>removeQuestion(fieldIndex,activeTab,questionIndex)} className="text-red-600"/>
                      </ButtonCustom>
                    </div>
                    <Divider className="mt-4"/>
                   </div>
              
                  ))
              }
              
              <div className="flex justify-end">
                <ButtonCustom
                  type="button"
                  color="secondary"
                  onClick={() => addQuestion(fieldIndex,activeTab)}
                >
                  Adicionar nova pergunta
                </ButtonCustom>
             
              </div>
     
        </CardBody>
       <div className="flex">
        <Button className="mr-2" onClick={handlePreviewStep} color="default" isDisabled={activeTab<=0}>
            Voltar
          </Button>
          <Button onClick={handleNextStep} color={isLast? "success":"primary"}>
            {isLast?"Finalizar":"Proximo"}
          </Button>
       </div>
      </Card>
      
    </div>
  );
}
