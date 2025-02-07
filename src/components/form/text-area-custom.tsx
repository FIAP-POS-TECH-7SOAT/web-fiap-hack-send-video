import { Textarea } from "@nextui-org/input"
import { Controller } from "react-hook-form"

type InputAreaCustomType={
  
  control:any
  name:string
  label?:string
}
export function TextAreaCustom({control,name,label}:InputAreaCustomType){
  return (
    <Controller
    name={name}
    control={control}
    render={({field})=>(
      <Textarea {...field} label={label}/>
    )}
    />
  
  )
}
