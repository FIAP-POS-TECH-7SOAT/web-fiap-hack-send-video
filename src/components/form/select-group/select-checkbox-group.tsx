import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import { Controller } from "react-hook-form";


export type SelectCheckBoxGroupValue ={
  title:string;
  value:string;
}
type SelectCheckBoxGroupType = {
  control:any;
  name:string
  label?:string
  values: SelectCheckBoxGroupValue[];
  defaultValue?:string[]
}
export function SelectCheckBoxGroup({control,name,values=[],label,defaultValue=[]}:SelectCheckBoxGroupType){
  return (
    <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({field})=>(
      <CheckboxGroup  {...field} label={label} aria-label="checkbox">
         {!!values.length && values.map(item=>(
          <Checkbox key={item.value} value={item.value}>{item.title}</Checkbox>
          
        ))}
      </CheckboxGroup>
    )}
    />
  
  )
}