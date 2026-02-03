"use client";

import { useEffect, useState } from "react";

import { FileText, Hash, Calendar, LucideIcon } from "lucide-react";
import { Badge, BadgeProps } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";
import {
  Tenant,
  TenantStatus,
  TenantStatusLabels,
} from "@/src/utils/tenant/types";

const badgeDictTenantStatus: Record<TenantStatus, BadgeProps["variant"]> = {
  [TenantStatus.ACTIVE]: "success",
  [TenantStatus.INACTIVE]: "destructive",
  [TenantStatus.SUSPENDED]: "destructive",
};

export default function EmpresaPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTenant() {
      try {
        const res = await fetch("/api/tenancy/me");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTenant(data);
      } finally {
        setLoading(false);
      }
    }

    loadTenant();
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-2 gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!tenant) {
    return <div className="p-6">Empresa não encontrada</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <div className="relative">
                <Input className="pl-9" value={tenant.name} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Input className="pl-9" value={tenant.email} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Informações adicionais
              <Badge variant={badgeDictTenantStatus[tenant.status]}>
                {TenantStatusLabels[tenant.status]}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem icon={FileText} label="CNPJ" value={tenant.cnpj} />
            <InfoItem icon={Hash} label="ID da Empresa" value={tenant.id} />
            <InfoItem
              icon={Calendar}
              label="Criado em"
              value={new Date(tenant.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
