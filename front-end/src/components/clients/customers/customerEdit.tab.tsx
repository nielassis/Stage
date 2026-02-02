"use client";

import { Customer } from "@/src/utils/customers/types";
import { updateCustomer } from "@/src/actions/customers/updateCustomer";
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
import { Input } from "@/src/components/ui/input";
import {
  UpdateCustomerFormData,
  updateCustomerSchema,
} from "@/src/app/dashboard/customers/schemas/editCustomer.zod.schema";
import Loader from "../../misc/layout/loader";

type Props = {
  customer: Customer;
  onUpdated: () => void;
};

export default function CustomerEditTab({ customer, onUpdated }: Props) {
  const form = useForm<UpdateCustomerFormData>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      document: customer.document,
      documentType: customer.documentType,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: UpdateCustomerFormData) {
    try {
      await updateCustomer(customer.id, data);
      toast.success("Cliente atualizado com sucesso");
      onUpdated();
    } catch {
      toast.error("Erro ao atualizar cliente");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 mt-4 max-w-xl"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
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
                    placeholder="email@cliente.com"
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
                  "
                >
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
                <Input placeholder="Documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader />}
            Salvar alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}
