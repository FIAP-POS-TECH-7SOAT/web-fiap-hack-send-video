import { Button, ButtonProps } from "@nextui-org/button"
import { ReactNode } from "react"



interface ButtonCustomType extends ButtonProps{
  
  
  
  children:ReactNode
  
}
export function ButtonCustom({type="button",children,...rest}:ButtonCustomType){
  return (

      <Button {...rest} type={type}>{children}</Button>


  
  )
}
