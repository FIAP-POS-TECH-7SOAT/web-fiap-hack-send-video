import { SelectCheckBoxGroup, SelectCheckBoxGroupValue } from "./select-checkbox-group";
import { SelectRadioGroup,SelectRadioGroupValue } from "./select-radio-group";

type SelectGroupType= | {
  multiple?:false;
  control:any
  name:string
  label?:string
  values:SelectRadioGroupValue[]
}|{
  multiple?:true;
  control:any
  name:string
  label?:string
  values:SelectCheckBoxGroupValue[]
}
export function SelectGroup({multiple=false,control,name,label,values}:SelectGroupType){
  
  if(multiple){
    return (
      <SelectCheckBoxGroup control={control} name={name} label={label}  values={values} />
    );
  }else{
    return (
    
      <SelectRadioGroup control={control} name={name} label={label} values={values} />
      )
  }
  
}