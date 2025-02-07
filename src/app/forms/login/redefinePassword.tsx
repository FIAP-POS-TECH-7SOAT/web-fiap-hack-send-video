"use client";

import CustomButton from "@/components/ui/button";
import InputField from "@/components/ui/input";
import Tip from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const redefinePasswordSchema = z.object({
  password: z.string(),
  repeatPassword: z.string(),
});

type RedefinePasswordSchema = z.infer<typeof redefinePasswordSchema>;

export function RedefinePassword() {
  const { register, handleSubmit } = useForm<RedefinePasswordSchema>({
    resolver: zodResolver(redefinePasswordSchema),
  });

  function handleRedefinePassword(data: RedefinePasswordSchema) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(handleRedefinePassword)} className="space-y-6">
      <InputField
        label={"Nova Senha"}
        type="password"
        className="border-[#27272A]"
        {...register("password")}
      />
      <InputField
        label={"Repetir senha"}
        type="password"
        className="border-[#27272A]"
        {...register("repeatPassword")}
      />
      <div className="flex justify-end">
        <Tip
          icon={Info}
          content="A senha deverá conter letra, número e caractere especial (!@#$%^&*) e ter no mínimo 8 caracteres. Exemplo: senha01@"
        />
      </div>
      <CustomButton
        className="bg-[#60A5FA] w-[358px] h-[50px] text-white"
        type="submit"
      >
        Redefinir
      </CustomButton>
    </form>
  );
}
