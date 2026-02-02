import TenantClient from "@/src/components/clients/tenant/tenant.client";
import React from "react";

export default function TenantPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Empresa
          </h1>
          <p className="text-muted-foreground">
            Gerencie os dados da sua empresa
          </p>
        </div>
      </div>

      <TenantClient />
    </>
  );
}
