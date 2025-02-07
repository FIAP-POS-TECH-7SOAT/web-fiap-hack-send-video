"use client";

import CustomButton from "@/components/ui/button";
import InputField from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyPasswordSchema = z.object({
  code: z.string().uuid(),
});

type VerifyPasswordSchema = z.infer<typeof verifyPasswordSchema>;

export function VerifyPassword() {
  const { register, handleSubmit } = useForm<VerifyPasswordSchema>({
    resolver: zodResolver(verifyPasswordSchema),
  });

  function handleVerifyPassword(data: VerifyPasswordSchema) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(handleVerifyPassword)} className="mt-8">
      <InputField
        label={"Código de verificação"}
        type="text"
        className="border-[#27272A]"
        isClearable
        {...register("code")}
      />
      {/* <div /> */}
      <CustomButton
        className="bg-[#60A5FA] w-[358px] h-[50px] mt-8 text-white"
        type="submit"
      >
        Verificar
      </CustomButton>
      <p className="mt-2 text-sm">
        {" "}
        Não recebi o e-mail.
        <Link href="/login/forgot-password" className="text-blue-600">
          &nbsp; Reenviar
        </Link>
      </p>
    </form>
  );
}
