"use client";

import { ButtonCustom } from "@/components/form/button-custom";
import { InputCustom } from "@/components/form/input-custom";
import { ToastManager } from "@/components/toast-manager";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { FaPhotoVideo } from "react-icons/fa";
import { z } from "zod";

const loginFormSchema = z.object({
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
      formState: { errors },
      
      control
    } = useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
    });
    
    
      const handleLoginForm = async (data: LoginFormSchema) => {
        try {
          
          const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirectTo: "/",
            redirect:false
          });
    
          if (result?.error) {
            throw new Error(result.error)
            
            
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error(error);
          ToastManager.error('Erro ao realizar login, tente novamente',3000)
        }
      };
  
  
  return (
    <div className="flex h-screen justify-center">
      <form onSubmit={handleSubmit(handleLoginForm)} className="flex flex-col w-6/12	p-16">
        <div className="mx-auto w-fit">
          <FaPhotoVideo
            size={200}
            
          />
        </div>
        <div className="flex flex-col gap-4">
          <InputCustom control={control} name="email" label="Digite seu Email" type="email" errorMessage={errors['email']?.message} isInvalid={!!errors['email']}/>
          <InputCustom control={control} name="password" label="Digite sua Senha" type="password" errorMessage={errors['password']?.message} isInvalid={!!errors['password']}/>
          <ButtonCustom type="submit" fullWidth color="primary">Entrar</ButtonCustom>
        </div>
      </form>
    </div>
  );
}
