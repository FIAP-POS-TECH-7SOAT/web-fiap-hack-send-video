"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import CustomButton from "@/components/ui/button";
import InputField from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  login: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Precisa conter ao menos 8 caracteres" })
    .regex(/[a-zA-Z]/, { message: "Precisa conter ao menos 1 letra" })
    .regex(/[0-9]/, { message: "Precisa conter ao menos 1 número." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Precisa conter ao menos 1 caractere especial.",
    })
    .trim(),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const handleLoginForm = async (data: LoginFormSchema) => {
    try {
      const result = await signIn("credentials", {
        email: data.login,
        password: data.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError("login", { message: result.error });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar login");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLoginForm)} className="space-y-8">
      <InputField
        label={"E-mail ou Matrícula"}
        type="email"
        isClearable
        className="border-[#27272A]"
        {...register("login")}
      />

      <InputField
        label={"Senha"}
        type="password"
        className="border-[#27272A]"
        {...register("password")}
      />

      <Link
        href="/login/forgot-password"
        className="block font-semibold text-right underline"
      >
        Esqueceu a senha?
      </Link>

      <CustomButton
        className="bg-[#581C87] w-[358px] h-[50px] text-white"
        type="submit"
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Carregando..." : "Acessar"}
      </CustomButton>
      {errors.login && <p className="text-red-500">{errors.login.message}</p>}
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
    </form>
  );
}
