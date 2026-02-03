"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Textarea } from "@/src/components/ui/textarea";

import { createStage } from "@/src/actions/os-stages/createStage";

const createStageSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type CreateStageForm = z.infer<typeof createStageSchema>;

export default function NewStagePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  console.log(id);

  const form = useForm<CreateStageForm>({
    resolver: zodResolver(createStageSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: CreateStageForm) {
    if (!id) return;
    console.log(id);
    console.log(data);

    try {
      await createStage({ ...data, osId: id });
      toast.success("Etapa criada com sucesso!");
      router.push(`/dashboard/os/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar etapa");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="h-10 w-10 mx-2"
          onClick={router.back}
        >
          <ArrowLeft className="h-5 w-5 cursor-pointer" />
        </Button>

        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">Etapas</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre uma nova etapa para a OS
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle>Nova etapa</CardTitle>
          </div>
          <CardDescription>Informe os dados da nova etapa</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      <Textarea
                        placeholder="Descrição da etapa"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting || !id}>
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Criar etapa
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
