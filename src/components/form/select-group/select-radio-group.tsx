import { Radio, RadioGroup } from "@nextui-org/react";
import { Controller } from "react-hook-form";

export type SelectRadioGroupValue ={
  title:string;
  value:string;
}
type SelectRadioGroupType = {
  control:any;
  name:string
  label?:string;
  values: SelectRadioGroupValue[]
}
export function SelectRadioGroup({control,name,label,values=[]}:SelectRadioGroupType){
  
  
  return (
    <Controller
    name={name}
    control={control}
    render={({field})=>(
      <RadioGroup  {...field} label={label} aria-label="radio">
        {!!values.length && values.map(item=>(
          <Radio key={item.value} value={item.value}>{item.title}</Radio>
        ))}
        
   
      </RadioGroup>
    )}
    />
  
  )
}