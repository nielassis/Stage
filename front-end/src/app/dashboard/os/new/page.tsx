"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ClipboardPlus } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
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

import { createOs } from "@/src/actions/os/createOs";
import { CreateOsDTO } from "@/src/utils/os/types";
import { z } from "zod";
import { listCustomers } from "@/src/actions/customers/listCustomers";
import Loader from "@/src/components/misc/layout/loader";

const createOsSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  description: z.string().min(5, "Descrição obrigatória"),
  amountCents: z.number().min(1, "Valor deve ser maior que 0"),
  customerId: z.string().nonempty("Selecione um cliente"),
});

type CreateOsFormData = z.infer<typeof createOsSchema>;

export default function CreateOsPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const form = useForm<CreateOsFormData>({
    resolver: zodResolver(createOsSchema),
    defaultValues: {
      name: "",
      description: "",
      amountCents: 0,
      customerId: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    let active = true;

    async function fetchFiltered() {
      setLoadingCustomers(true);
      try {
        const data = await listCustomers();

        const list = Array.isArray(data) ? data : data?.data || [];
        if (!active) return;
        setCustomers(list);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao buscar clientes");
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    }

    const timer = setTimeout(fetchFiltered, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  async function onSubmit(data: CreateOsFormData) {
    try {
      await createOs(data as CreateOsDTO);
      toast.success("Ordem de serviço criada com sucesso!");
      router.push("/dashboard/os");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar ordem de serviço");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Link href="/dashboard/os">
          <Button variant="ghost" className="h-10 w-10">
            <ArrowLeft className="h-5 w-5 cursor-pointer" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ordens de Serviço
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie uma nova ordem de serviço
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardPlus className="h-5 w-5 text-primary" />
            <CardTitle>Criar OS</CardTitle>
          </div>
          <CardDescription>Cadastre uma nova ordem de serviço</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={loadingCustomers}
                        className="h-10 w-full rounded-md border border-input px-3 text-sm text-gray-700"
                      >
                        {loadingCustomers ? (
                          <option>Carregando clientes...</option>
                        ) : (
                          <>
                            <option value="">Selecione um cliente...</option>
                            {customers.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </FormControl>
                    <FormMessage />

                    {/* Optional: um pequeno loader visual ao lado do select */}
                    {loadingCustomers && <Loader />}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da OS</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Detalhes da OS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amountCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
                  Criar OS
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
