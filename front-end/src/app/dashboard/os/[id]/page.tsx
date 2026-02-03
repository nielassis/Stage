"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge, BadgeProps } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";

import {
  ArrowLeft,
  CheckCircle2,
  CheckCheck,
  X,
  DollarSign,
  Calendar,
  User,
  UserX,
} from "lucide-react";

import { useAuth } from "@/src/contexts/authContext";
import { getOsById } from "@/src/actions/os/getOsById";
import { listOsUsers } from "@/src/actions/os/listOsUsers";
import { joinOs } from "@/src/actions/os/joinOs";
import { closeOs } from "@/src/actions/os/closeOs";
import { cancelOs } from "@/src/actions/os/cancelOs";

import { InfoRow } from "@/src/components/misc/layout/os/itemRow";
import Loader from "@/src/components/misc/layout/loader";
import NoResultFallback from "@/src/components/misc/layout/noResultFallback";

import { TenantOsItem, OsListUser } from "@/src/utils/os/types";
import { StageItem } from "@/src/utils/os-stages/types";
import {
  OsStageStatus,
  OsStageStatusLabels,
  OsStatus,
  OsStatusLabels,
} from "@/src/utils/dashboard/types";
import { UserRole } from "@/src/utils/auth/types";
import { getSliceId } from "@/src/utils/ui/getSliceId";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { getAvatarLetters } from "@/src/utils/userContext/getAvatarImage";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { UsersTableSkeleton } from "@/src/components/ui/skeleton/usersTableSkeleton";

import { listOsStages } from "@/src/actions/os-stages/listStage";

const badgeDictOsStatus: Record<OsStatus, BadgeProps["variant"]> = {
  [OsStatus.CANCELLED]: "destructive",
  [OsStatus.IN_PROGRESS]: "link",
  [OsStatus.CLOSED]: "success",
};

const badgeDictOsStageStatus: Record<OsStageStatus, BadgeProps["variant"]> = {
  [OsStageStatus.COMPLETED]: "success",
  [OsStageStatus.CANCELLED]: "destructive",
  [OsStageStatus.OPEN]: "link",
  [OsStageStatus.PENDING_APPROVAL]: "link",
  [OsStageStatus.REJECTED]: "destructive",
};

export default function OsDetailPage() {
  const { id } = useParams();
  const { user: me } = useAuth();

  const [os, setOs] = useState<TenantOsItem | null>(null);
  const [osUsers, setOsUsers] = useState<OsListUser[]>([]);
  const [osStages, setOsStages] = useState<StageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [stagesLoading, setStagesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      setLoading(true);
      setUsersLoading(true);
      setStagesLoading(true);
      try {
        const [osData, usersData, stagesData] = await Promise.all([
          getOsById({ id: id as string }),
          listOsUsers(id as string),
          listOsStages({ osId: id as string }),
        ]);
        setOs(osData);
        setOsUsers(usersData);
        setOsStages(stagesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setUsersLoading(false);
        setStagesLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (!me || loading) return <Skeleton className="h-100 w-full rounded-md" />;
  if (!os) return <p>OS não encontrada</p>;

  async function handleJoin() {
    setActionLoading("join");
    try {
      await joinOs({ id: id as string });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleClose() {
    setActionLoading("close");
    try {
      await closeOs({ id: id as string });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel() {
    setActionLoading("cancel");
    try {
      await cancelOs({ id: id as string });
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/os">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">{os.name}</h1>
            <Badge variant={badgeDictOsStatus[os.status]}>
              {OsStatusLabels[os.status]}
            </Badge>
          </div>
          <p>{os.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4 flex-1">
        <Card className="lg:col-span-2 px-4">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-xl font-semibold">Etapas</h2>
            <Link href={`/dashboard/os/${id}/stage/new`}>
              <Button size="sm">+ Nova Etapa</Button>
            </Link>
          </div>

          <Card className="lg:col-span-2 px-4 flex-1 border-none shadow-none">
            {stagesLoading ? (
              <Skeleton className="h-20 w-full rounded-md" />
            ) : osStages.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma etapa cadastrada</p>
            ) : (
              osStages.map((stage, idx) => (
                <Link
                  key={stage.id}
                  href={`/dashboard/os/${id}/stage/${stage.id}`}
                >
                  <Card className="flex flex-row justify-between items-center p-2 cursor-pointer hover:bg-background/80">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full ml-2 flex items-center justify-center font-bold bg-gray-100 p-4 text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{stage.name}</h3>
                        <p className="text-sm">{stage.description}</p>
                      </div>
                    </div>
                    <Badge variant={badgeDictOsStageStatus[stage.status]}>
                      {OsStageStatusLabels[stage.status]}
                    </Badge>
                  </Card>
                </Link>
              ))
            )}
          </Card>
        </Card>

        <div className="space-y-6">
          <Card className="border p-4 space-y-4">
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
          <Card className="px-4">
            <h2 className="text-xl font-semibold mb-2">Ações</h2>

            <div className="flex flex-col gap-1">
              <Button
                variant="link"
                className="w-full border-primary border-2 text-primary hover:bg-muted-foreground/80 hover:text-white"
                disabled={
                  me.id === os.responsible?.id ||
                  (osUsers.find((user) => user.id === me.id) as
                    | OsListUser
                    | undefined) !== undefined ||
                  os.status === OsStatus.CLOSED ||
                  os.status === OsStatus.CANCELLED ||
                  actionLoading === "join"
                }
                onClick={handleJoin}
              >
                {actionLoading === "join" ? (
                  <Loader />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Participar da OS
              </Button>

              {(me.role === UserRole.ADMIN ||
                me.role === UserRole.PLATFORM_ADMIN ||
                me.role === UserRole.SUPERVISOR) && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleClose}
                    disabled={
                      actionLoading === "close" ||
                      os.status === OsStatus.CLOSED ||
                      os.status === OsStatus.CANCELLED
                    }
                  >
                    {actionLoading === "close" ? (
                      <Loader />
                    ) : (
                      <CheckCheck className="h-4 w-4 mr-2" />
                    )}
                    Fechar OS
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full bg-transparent text-destructive hover:bg-destructive/80 border-destructive border-2"
                    onClick={handleCancel}
                    disabled={
                      actionLoading === "cancel" ||
                      os.status === OsStatus.CLOSED ||
                      os.status === OsStatus.CANCELLED
                    }
                  >
                    {actionLoading === "cancel" ? (
                      <Loader />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Cancelar OS
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-6 text-muted-foreground">
        Usuários relacionados à ordem de serviço
      </p>
      <div className="rounded-xl shadow-md border bg-card overflow-hidden flex flex-col mt-4">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead>Id</TableHead>
              <TableHead>Usuário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading ? (
              <UsersTableSkeleton limit={20} />
            ) : osUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <NoResultFallback
                    text="Nenhum usuário encontrado"
                    icon={UserX}
                  />
                </TableCell>
              </TableRow>
            ) : (
              osUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="italic text-muted-foreground">
                    #{getSliceId(user.id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getAvatarLetters(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium leading-tight">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
