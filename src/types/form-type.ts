
export type QuestionsAnswerType = "free-text" | "select" | "select-multiple";

export type FormStepType = {
  id:string;
  title:string;
  step_number:string;
  questions: QuestionType[]
}
export type FormType =  {
  id:string;
  name:string
  steps: FormStepType[]
}
export type QuestionType = {
  question: string;
  field_name:string;
  type: QuestionsAnswerType;
  multiple: boolean;
  options: { value: string; title: string }[] | null;
};


export type FormInputStep = {
  id:string;
  title:string;
  step_number:string;
  questions: FormInputItem[]
}

export type FormInputSteps ={
  id:string;
  name:string
  steps: FormInputStep[];
  validations?:unknown
}
export type FormInputItem ={
  question: string;
  field_name:string,
  answer_type: QuestionsAnswerType;
  options: string;
}
export type FormInput ={
  form:FormInputSteps[]
}

