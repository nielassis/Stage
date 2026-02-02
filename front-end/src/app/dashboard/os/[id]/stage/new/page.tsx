"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import Loader from "@/src/components/misc/layout/loader";

import { createStage } from "@/src/actions/os-stages/createStage";

const createStageSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type CreateStageForm = z.infer<typeof createStageSchema>;

export default function NewStagePage() {
  const { osId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateStageForm>({
    resolver: zodResolver(createStageSchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(data: CreateStageForm) {
    if (!osId) return;
    setLoading(true);
    try {
      await createStage({ ...data, osId: osId as string });
      toast.success("Etapa criada com sucesso!");
      router.push(`/dashboard/os/${osId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar etapa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start">
      <Card className="w-full max-w-lg shadow-lg rounded-xl border border-gray-100">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Nova Etapa</CardTitle>
          </div>
          <CardDescription>
            Cadastre uma nova etapa para esta ordem de serviço
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da etapa" {...field} />
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
                      <Textarea placeholder="Descrição da etapa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full flex justify-center items-center gap-2"
                variant="default"
                disabled={loading}
              >
                {loading && <Loader />}
                Criar Etapa
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
