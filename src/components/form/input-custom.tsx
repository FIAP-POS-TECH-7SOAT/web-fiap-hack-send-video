import { Input, InputProps } from "@nextui-org/input"
import { Controller } from "react-hook-form"

type InputCustomType={
  
  control:any
  name:string
  label?:string
} & InputProps
export function InputCustom({control,name,label, ...rest}:InputCustomType){
  return (
    <Controller
    name={name}
    control={control}
    render={({field})=>(
      <Input {...rest} {...field} label={label} />
    )}
    />
  
  )
}
