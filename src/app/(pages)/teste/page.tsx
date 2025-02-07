"use client"
import { useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

interface Question {
  question: string;
  type: string;
  multiple: boolean;
  options: { title: string; value: string }[];
}

interface Step {
  step_number: number;
  title: string;
  questions: Question[];
}

interface FormStepsProps {
  steps: Step[];
}



const steps = [
  {
    step_number: 1,
    title: "Informações Pessoais",
    questions: [
      { question: "Qual seu nome?", type: "free-text", multiple: false, options: [] },
      { question: "Qual sua idade?", type: "free-text", multiple: false, options: [] },
    ],
  },
  {
    step_number: 2,
    title: "Preferências",
    questions: [
      {
        question: "Qual sua cor favorita?",
        type: "select",
        multiple: false,
        options: [
          { title: "Azul", value: "blue" },
          { title: "Verde", value: "green" },
          { title: "Vermelho", value: "red" },
        ],
      },
    ],
  },
  {
    step_number: 3,
    title: "Confirmação",
    questions: [
      {
        question: "Deseja receber notificações?",
        type: "select",
        multiple: false,
        options: [
          { title: "Sim", value: "yes" },
          { title: "Não", value: "no" },
        ],
      },
    ],
  },
];



export default function FormSteps({  }: FormStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
      <Card className="w-full max-w-3xl p-6 bg-gray-800">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
          <span className="text-sm text-gray-400">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </CardHeader>
        <CardBody>
          {steps[currentStep].questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-2 font-semibold" aria-label="steps">
                {question.question}
              </label>
              {question.type === "free-text" && (
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {question.type === "select" && (
                <select className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {question.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.title}
                    </option>
                  ))}
                </select>
              )}
              {question.type === "select-multiple" && (
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <label key={option.value} className="flex items-center" aria-label="teste-checkbox">
                      <input
                        type="checkbox"
                        value={option.value}
                        className="mr-2"
                      />
                      {option.title}
                    </label>
                  ))}
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
