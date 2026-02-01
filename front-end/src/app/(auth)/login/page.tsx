"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { AuthCard } from "@/src/components/misc/auth/authCard";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import { formSchema } from "./schemas/loginForm.zod.schema";
import { useAuth } from "@/src/contexts/authContext";
import Loader from "@/src/components/misc/layout/loader";

export default function LoginPage() {
  const [error, setError] = useState("");
  const { signIn, isSigningIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setError("");

    const success = await signIn(data);

    if (!success) {
      setError("Usuário ou senha inválidos.");
    }
  }

  return (
    <AuthCard
      title="Fazer Login"
      description="Entre com suas credenciais para acessar o sistema"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 text-left"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu.email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && <p className="text-start text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="h-11 w-full rounded-lg flex items-center justify-center gap-2"
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <>
                <Loader />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
