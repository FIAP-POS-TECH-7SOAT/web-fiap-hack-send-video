import { useEffect, useState } from "react";
import { Input, Button, Checkbox, Select, SelectItem, CheckboxGroup } from "@nextui-org/react";
import { z } from "zod";


const validationOptions: Record<string, string[]> = {
  string: ["min", "max", "email", "url", "regex","optional"],
  number: ["min", "max", "positive", "negative", "int","optional"],
  array: ["min", "max","optional"],
};

type ZodSchemaBuilderProps ={
  handleCreateSchema:(schema:any,fieldName:string)=>void
  nameField:string;
  multiple?:boolean
}
export function ZodSchemaBuilder({handleCreateSchema,nameField,multiple=false}:ZodSchemaBuilderProps) {
  const [fieldType, setFieldType] = useState(new Set<string>([]));
  const [validations, setValidations] = useState<Record<string, any>>({});
  const [generatedSchema, setGeneratedSchema] = useState("");
  const selectedValue = !!Array.from(fieldType).length ? Array.from(fieldType)[0] : "";
  const handleValidationChange = (key: string, value: any) => {
    setValidations((prev) => ({ ...prev, [key]: value }));
  };

  const generateSchema = () => {
    console.log('fieldType',nameField,multiple);
    
    let schema = multiple?'z.array(z.string())': `z`;   
    
    

    for (const [key, value] of Object.entries(validations)) {
      if (value !== undefined && value !== "") {
        schema += `.${key}(${typeof value === "boolean" ? "" : value})`;
      }
    }    
    
    setGeneratedSchema(schema);
    handleCreateSchema({[nameField]:schema},nameField)
  };
  // useEffect(()=>{
  //   if(multiple){
  //     validationOptions = validationOptions['array']
  //   }
  // },[])
  
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-bold">Zod Schema Builder</h1>

      
      <div>
      
        <Select
          items={Object.keys(validationOptions).filter(f=>multiple? f==='array':f!=='array').map(item=>({key:item,label:item}))}
          onSelectionChange={setFieldType as any}
          selectedKeys={fieldType}
          label="Choose a type"
        >
         {(type) => <SelectItem>{type.label}</SelectItem>}
        </Select>
      </div>
      
      {/* Render Validation Options */}
      <div className="space-y-4">
        <CheckboxGroup>
          {validationOptions[selectedValue]?.map((validation:any) => (
            <div key={validation} className="flex items-center space-x-4">
              
              <Checkbox
                value={validation}
                onChange={(checked) =>
                  handleValidationChange(validation, checked ? true : undefined)
                }
              >
                {validation.charAt(0).toUpperCase() + validation.slice(1)}
              </Checkbox>
              {/* Inputs for validations that require a value */}
              {(validation === "min" || validation === "max" || validation === "regex") && (
                <Input
                  type={validation === "regex" ? "text" : "number"}
                  placeholder={`Enter ${validation}`}
                  size="sm"
                  onChange={(e) =>
                    handleValidationChange(validation, e.target.value)
                  }
                  disabled={!validations[validation]}
                />
              )}
            </div>
          ))}
        </CheckboxGroup>
      </div>

      {/* Generate Button */}
      <Button color="primary" onPress={generateSchema}>
        Atribuir validação
      </Button>

      {/* Display Generated Schema */}
      {generatedSchema && (
        <div className="p-4 bg-zinc-800 rounded-md">
          <code className="text-sm break-words">{generatedSchema}</code>
        </div>
      )}
    </div>
  );
};


