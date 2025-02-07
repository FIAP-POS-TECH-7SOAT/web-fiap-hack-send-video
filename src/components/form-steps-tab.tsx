import { useCallback, useRef, useState } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FormStepType } from "@/types/form-type";
import { InputCustom } from "./form/input-custom";
import { SelectGroup } from "./form/select-group";


type FormStepTabType={
  steps: FormStepType[];
  control:any;
  onNextStep?:()=>void
}
export default function FormStepsTab({steps,control,onNextStep}:FormStepTabType) {
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
        <div
          ref={tabsRef}
          className="flex overflow-x-hidden no-scrollbar scroll-smooth space-x-2"
        >
          {steps.map((item,index) => (
            <Button
              key={item.id}
              
              
              color={activeTab === index ? "primary" : "default"}
              onPress={() => setActiveTab(index)}
              className="whitespace-nowrap shrink-0"
            >
              {item.title}
            </Button>
          ))}
        </div>
      </div>

      

      <Card className="mt-4 p-4">
        
        {steps.map((step,stepIndex)=>step.questions.map((question, index) => (
          <CardBody key={index} className={activeTab!==stepIndex?"hidden":""}>
            <div  className="mb-4" >
              <label className="block mb-2 font-semibold" aria-label="step">
                {question.question}
                {question.field_name}
              </label>
              
              {question.type === "free-text" && (
                <InputCustom control={control} name={`steps[${stepIndex}].${String(question.field_name)}`} />
                
                
              )}
              {["select", "select-multiple"].includes(question.type) && question.options && (
                <div>
                  <SelectGroup control={control} name={`steps[${stepIndex}].${String(question.field_name)}`} multiple={question.type !== "select"} values={question.options}/>            
                </div>
              )}
            </div>
          </CardBody>
          )))}
        
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
