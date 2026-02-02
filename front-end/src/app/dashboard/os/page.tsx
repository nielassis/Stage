import OsClient from "@/src/components/clients/os/os.client";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function OsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Ordens de Servico
          </h1>
          <p className="text-muted-foreground">
            Gerencie todas as ordens de serviço
          </p>
        </div>

        <Link href="/dashboard/os/new">
          <Button className="w-fit items-center" variant="default">
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden md:block">Criar OS</span>
          </Button>
        </Link>
      </div>

      <OsClient />
    </>
  );
}
