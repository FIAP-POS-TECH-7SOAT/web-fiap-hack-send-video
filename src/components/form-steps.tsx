"use client"
import { useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { InputCustom } from "./form/input-custom";
import { FormStepType, QuestionType } from "@/types/form-type";
import { SelectGroup } from "./form/select-group";




interface FormStepsProps {
  steps: FormStepType[];
  control:any;
  onClick?:()=>void
}



export default function FormSteps({ steps,control, onClick }: FormStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    if(onClick){
      onClick()
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full min-h-screen text-gray-100 px-4">
      <Card className="w-full p-6 ">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
          <span className="text-sm text-gray-400">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </CardHeader>
        <CardBody>
          {steps[currentStep].questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-2 font-semibold" aria-label="step">
                {question.question}
              </label>
              
              {question.type === "free-text" && (
                <InputCustom control={control} name={String(question.field_name)} />
                
                
              )}
              {["select", "select-multiple"].includes(question.type) && question.options && (
                <div>
            
                    <SelectGroup control={control} name={String(question.field_name)} multiple={question.type === "select"} values={question.options}/>
            
                </div>
              )}
            </div>
          ))}
        </CardBody>
        <CardFooter className="flex justify-between">
          <Button
            disabled={currentStep === 0}
            onClick={handleBack}
            
            color="primary"
          >
            Voltar
          </Button>
          <Button onClick={handleNext} color="success">
            {isLastStep ? "Finalizar" : "Próximo"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
