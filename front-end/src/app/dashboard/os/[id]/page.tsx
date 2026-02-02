"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Badge, BadgeProps } from "@/src/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  MoreVertical,
  Plus,
  User,
} from "lucide-react";

import { useAuth } from "@/src/contexts/authContext";
import { getOsById } from "@/src/actions/os/getOsById";

import { TenantOsItem } from "@/src/utils/os/types";

import Link from "next/link";
import { InfoRow } from "@/src/components/misc/layout/os/itemRow";

import { joinOs } from "@/src/actions/os/joinOs";
import Loader from "@/src/components/misc/layout/loader";
import { OsStatus } from "@/src/utils/dashboard/types";

const badgeDictOsStatus: Record<OsStatus, BadgeProps["variant"]> = {
  [OsStatus.CANCELLED]: "destructive",
  [OsStatus.IN_PROGRESS]: "link",
  [OsStatus.CLOSED]: "success",
};

export default function OsDetailPage() {
  const { id } = useParams();

  const { user: me } = useAuth();

  const [os, setOs] = useState<TenantOsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadOs() {
      setLoading(true);
      try {
        const data = await getOsById({ id: id as string });
        setOs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadOs();
  }, [id]);

  if (!me || loading) return <Skeleton className="h-100 w-full rounded-md" />;

  if (!os) return <p>OS não encontrada</p>;

  async function handleJoin() {
    if (!os) return;
    setActionLoading(true);
    try {
      await joinOs({ id: os.id });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screenp-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/os">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">{os.name}</h1>
            <Badge variant={badgeDictOsStatus[os.status]}>Em Andamento</Badge>
          </div>
          <p>{os.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4">
        <Card className="lg:col-span-2 px-4 ">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Etapas</h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Nova Etapa
            </Button>
          </div>

          <Card className="border-none p-2">
            {[
              {
                id: 1,
                title: "Analise de Requisitos",
                desc: "Levantamento detalhado das necessidades do cliente",
                status: "Concluido",
                color: "text-green-500",
              },
              {
                id: 2,
                title: "Desenvolvimento Modulo A",
                desc: "Implementacao do primeiro modulo do sistema",
                status: "Concluido",
                color: "text-green-500",
              },
              {
                id: 3,
                title: "Desenvolvimento Modulo B",
                desc: "Implementacao do segundo modulo do sistema",
                status: "Aguardando Aprovação",
                color: "text-yellow-500",
              },
              {
                id: 4,
                title: "Testes e Validacao",
                desc: "Testes unitarios e de integracao",
                status: "Aberto",
                color: "text-slate-400",
              },
            ].map((step) => (
              <Card
                key={step.id}
                className="flex flex-row justify-between p-3 border-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="font-medium ">{step.title}</h3>
                    <p className="text-sm">{step.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`bg-transparent ${step.color} font-normal`}
                  >
                    {step.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </Card>
        </Card>

        <div className="space-y-6">
          <Card className=" border p-4 space-y-4">
            <h2 className="text-xl font-semibold">Informações</h2>
            <div className="space-y-3">
              <InfoRow
                icon={<User className="h-5 w-5" />}
                label="Cliente"
                value={os.customer?.name || "—"}
              />
              <InfoRow
                icon={<DollarSign className="h-5 w-5" />}
                label="Valor"
                value={`R$ ${os.amountCents.toLocaleString()}`}
              />
              <InfoRow
                icon={<Calendar className="h-5 w-5" />}
                label="Criado em"
                value="01/06/2024, 07:00"
              />
              <InfoRow
                icon={<User className="h-5 w-5" />}
                label="Responsável"
                value={os.responsible?.name || "—"}
              />
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold">Ações</h2>

            <Button
              variant="default"
              className="w-full"
              disabled={me.id === os.responsible?.id}
              onClick={handleJoin}
            >
              {actionLoading ? <Loader /> : ""}
              <CheckCircle2 className="h-4 w-4 mr-2" /> Participar da OS
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
