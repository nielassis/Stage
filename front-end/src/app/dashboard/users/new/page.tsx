"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

import { createTenantUser } from "@/src/actions/users/createTenantUser";
import {
  CreateUserFormData,
  createUserSchema,
} from "../schemas/createUser.zod.schema";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
    },
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  async function onSubmit(data: CreateUserFormData) {
    try {
      await createTenantUser(data);
      toast.success("Usuário criado com sucesso!");
      router.push("/dashboard/users");
    } catch (err) {
      toast.error("Não foi possível criar o usuário");
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Link href="/dashboard/users">
          <Button variant="ghost" className="h-10 w-10 mx-2">
            <ArrowLeft className="h-5 w-5 cursor-pointer" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os usuários da sua empresa
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle>Criar usuário</CardTitle>
          </div>
          <CardDescription>
            Cadastre um novo usuário e defina seu nível de acesso
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="joao@empresa.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>

                    <FormControl>
                      <select
                        {...field}
                        className="
            h-10 w-full rounded-md border border-input bg-background
            px-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
          "
                      >
                        <option value="" disabled>
                          Selecione a função do usuário
                        </option>

                        <option value="ADMIN">Administrador</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="COLLABORATOR">Colaborador</option>
                      </select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Criar usuário
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
