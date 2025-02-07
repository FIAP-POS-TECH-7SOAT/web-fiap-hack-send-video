import { Input } from "@nextui-org/input";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { ButtonCustom } from "./button-custom";
import { ButtonProps } from "@nextui-org/button";
import { FaRegTrashAlt } from "react-icons/fa";

type ButtonEditableType = {
  control: any;
  name: string;
  label?: string;
  isAllowToEdit?:boolean
  onDelete?:()=>void
} &  ButtonProps;

export function ButtonEditable({ control, name, label,isAllowToEdit=true,onDelete,...rest }: ButtonEditableType) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isEditing ? (
            <>
              {/* Campo de entrada para edição */}
              <Input
                {...field}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                label={label}
              />
              {/* Botão de confirmação */}
              <FaCheck
                onClick={() => {
                  field.onChange(tempValue); // Atualiza o valor no react-hook-form
                  setIsEditing(false); // Sai do modo de edição
                }}
                style={{ cursor: "pointer", color: "green" }}
              />
              {/* Botão de cancelamento */}
              <IoMdClose
                onClick={() => {
                  setTempValue(field.value); // Reverte para o valor original
                  setIsEditing(false); // Sai do modo de edição
                }}
                style={{ cursor: "pointer", color: "red" }}
              />
            </>
          ) : (
            <>
              {/* Exibe o valor como texto quando não está editando */}
              <ButtonCustom {...rest}>{field.value || "Clique para editar"}</ButtonCustom>
              {/* Botão para ativar o modo de edição */}
              {isAllowToEdit && 
              <>
                <MdEdit
                  onClick={() => {
                    setTempValue(field.value); // Define o valor atual como temporário
                    setIsEditing(true); // Entra no modo de edição
                  }}
                  style={{ cursor: "pointer" }}
                />
                <FaRegTrashAlt
                  onClick={() => {
                    if(onDelete){
                      onDelete()
                    }
                  }}
                  style={{ cursor: "pointer" }}
                />
              </>
              }
            </>
          )}
        </div>
      )}
    />
  );
}
