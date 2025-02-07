"use client";

import CustomButton from "@/components/ui/button";
import InputField from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  login: z.string(),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const { register, handleSubmit } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function handleForgotPasswordForm(data: ForgotPasswordSchema) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(handleForgotPasswordForm)} className="mt-8">
      <InputField
        label={"E-mail ou Matrícula"}
        type="text"
        isClearable
        className="border-[#27272A]"
        {...register("login")}
      />
      {/* <div /> */}
      <CustomButton
        className="bg-[#60A5FA] w-[358px] h-[50px] mt-8 text-white"
        type="submit"
      >
        Enviar
      </CustomButton>
    </form>
  );
}
