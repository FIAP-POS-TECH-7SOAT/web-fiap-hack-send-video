"use client"
import React, { ReactNode } from "react"

type THooks ={
  children:ReactNode
}

export function Hooks({children}:THooks){
  return (    
        {children}
  )
}