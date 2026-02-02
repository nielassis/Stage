"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Customer } from "@/src/utils/customers/types";
import { getCustomerById } from "@/src/actions/customers/getCustomerById";
import { deleteCustomer } from "@/src/actions/customers/deleteCustomer";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

import CustomerDetails from "@/src/components/clients/customers/clientDetails.tab";
import CustomerEditTab from "@/src/components/clients/customers/customerEdit.tab";
import { CustomerDetailsSkeleton } from "@/src/components/ui/skeleton/customerSkeleton";
import { CustomerEditSkeleton } from "@/src/components/ui/skeleton/customerEditSkeleton";

export default function CustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCustomer = useCallback(async () => {
    try {
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch {
      toast.error("Erro ao carregar cliente");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) return;

    try {
      await deleteCustomer(id);
      toast.success("Cliente deletado com sucesso");
      router.push("/dashboard/customers");
    } catch {
      toast.error("Erro ao deletar cliente");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Link href="/dashboard/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div>
            {loading ? (
              <>
                <div className="h-6 w-40 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded-md mt-1 animate-pulse" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">{customer?.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Detalhes do cliente
                </p>
              </>
            )}
          </div>
        </div>

        {!loading && (
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Card className="p-4">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Dados</TabsTrigger>
            <TabsTrigger value="edit">Editar</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="w-full">
            {loading || !customer ? (
              <CustomerDetailsSkeleton />
            ) : (
              <CustomerDetails customer={customer} />
            )}
          </TabsContent>

          <TabsContent value="edit">
            {loading || !customer ? (
              <CustomerEditSkeleton />
            ) : (
              <CustomerEditTab customer={customer} onUpdated={loadCustomer} />
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
