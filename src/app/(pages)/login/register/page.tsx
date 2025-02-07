"use client";

import { ButtonCustom } from "@/components/form/button-custom";
import { InputCustom } from "@/components/form/input-custom";
import { ToastManager } from "@/components/toast-manager";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaPhotoVideo } from "react-icons/fa";
import { z } from "zod";

const loginFormSchema = z.object({
  name: z.string({message:'Nome é obrigatorio'}),
  
  phone: z.string({message:'Telefone é obrigatorio'}).min(8,{message:'Telefone deve conter pelo menos 8 digitos'}).max(13,{message:'Telefone deve não conter mais de 13 digitos'}),
  email: z.string({message:'Email é obrigatorio'}).email({ message: "Informe um email valido" }),
  password: z
    .string({message:'Senha é obrigatorio'})
    .min(6, { message: "Precisa conter ao menos 6 caracteres" })

});
type LoginFormSchema = z.infer<typeof loginFormSchema>;
export default function LoginPage() {
    const router = useRouter();
    const {
      
      handleSubmit,
      formState: { errors,isLoading},
      control
    } = useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
    });

      const handleLoginForm = async (data: LoginFormSchema) => {
        try {
          
          const response = await fetch(
            `/api/user`,
            {
              method: "POST",
              body: JSON.stringify({
                user_email: data.email,
                password: data.password,
                phone: data.phone,
                name: data.name,
                
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          
          const toJson = await response.json()
          if (!response.ok) {
            
            throw new Error(toJson)
            
          } else {
            ToastManager.success('Usuario cadastrado com sucesso.',3000);
            router.push("/");
          }
        } catch (error) {
          console.error(error);
          ToastManager.error('Erro ao cadastrar usuario, tente novamente',3000)
          
        }
      };
  console.log('isLoading',isLoading);
  
  
  return (
    <div className="flex h-screen justify-center">
      <form onSubmit={handleSubmit(handleLoginForm)} className="flex flex-col w-6/12	p-16">
        <div className="mx-auto w-fit">
          <FaPhotoVideo
            size={200}
            
          />
        </div>
        <div className="flex flex-col gap-4">
          <InputCustom control={control} name="name" label="Digite seu Nome" errorMessage={errors['name']?.message} isInvalid={!!errors['name']} />
          <InputCustom control={control} name="email" label="Digite seu Email" type="email" errorMessage={errors['email']?.message} isInvalid={!!errors['email']} />
          <InputCustom control={control} name="phone" label="Digite seu telefone" errorMessage={errors['phone']?.message} isInvalid={!!errors['phone']} />
          <InputCustom control={control} name="password" label="Digite sua Senha" type="password"errorMessage={errors['password']?.message} isInvalid={!!errors['password']} />
          <ButtonCustom type="submit" fullWidth color="primary" isLoading={isLoading}>Criar conta</ButtonCustom>
     
        </div>
      </form>
    </div>
  );
}
