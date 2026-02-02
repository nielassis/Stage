"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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

import { createCustomer } from "@/src/actions/customers/createCustomer";
import {
  CreateCustomerFormData,
  createCustomerSchema,
} from "../schemas/createCustomer.zod.schema";

export default function CreateCustomerPage() {
  const router = useRouter();

  const form = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      documentType: undefined,
      document: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: CreateCustomerFormData) {
    try {
      await createCustomer(data);
      toast.success("Cliente criado com sucesso!");
      router.push("/dashboard/customers");
      router.refresh();
    } catch (err) {
      toast.error("Não foi possível criar o cliente");
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Link href="/dashboard/customers">
          <Button variant="ghost" className="h-10 w-10 mx-2">
            <ArrowLeft className="h-5 w-5 cursor-pointer" />
          </Button>
        </Link>

        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os clientes da sua empresa
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle>Criar cliente</CardTitle>
          </div>
          <CardDescription>Cadastre um novo cliente no sistema</CardDescription>
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
                          placeholder="joao@email.com"
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
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de documento</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="
                          h-10 w-full rounded-md border border-input bg-background
                          px-3 text-sm
                          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                          disabled:cursor-not-allowed disabled:opacity-50
                        "
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecione o tipo de documento
                        </option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o documento" {...field} />
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
                  Criar cliente
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
