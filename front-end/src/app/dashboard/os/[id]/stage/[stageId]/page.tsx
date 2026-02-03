"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge, BadgeProps } from "@/src/components/ui/badge";

import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";

import {
  OsStageStatus,
  OsStageStatusLabels,
  StageDetailsItem,
} from "@/src/utils/os-stages/types";

import { useAuth } from "@/src/contexts/authContext";
import { getStageById } from "@/src/actions/os-stages/getStageById";
import {
  approveStage,
  rejectStage,
  requestApprovalStage,
} from "@/src/actions/os-stages/changeStageStatus";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

const badgeDictOsStageStatus: Record<OsStageStatus, BadgeProps["variant"]> = {
  [OsStageStatus.COMPLETED]: "success",
  [OsStageStatus.CANCELLED]: "destructive",
  [OsStageStatus.OPEN]: "link",
  [OsStageStatus.PENDING_APPROVAL]: "warning",
  [OsStageStatus.REJECTED]: "destructive",
};

export default function StageDetailsPage() {
  const { id, stageId } = useParams<{ id: string; stageId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [stage, setStage] = useState<StageDetailsItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [notes, setNotes] = useState("");

  useEffect(() => {
    getStageById({ osId: id, stageId })
      .then(setStage)
      .catch(() => toast.error("Erro ao carregar etapa"));
  }, [id, stageId]);

  if (!stage) return null;

  const canApproveOrReject =
    user?.role === "SUPERVISOR" ||
    user?.role === "ADMIN" ||
    user?.role === "PLATFORM_ADMIN";

  const canRequestApproval = user?.role === "COLLABORATOR";

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/os/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">{stage.name}</h1>

            <Badge variant={badgeDictOsStageStatus[stage.status]}>
              {OsStageStatusLabels[stage.status]}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Etapa da OS #{stage.osId.slice(0, 6)}
          </p>
        </div>
      </div>

      <Card className="mt-8 ">
        <CardHeader>
          <h2 className="font-semibold">Descrição</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {stage.description || "Sem descrição"}
          </p>
        </CardContent>
      </Card>

      {(canApproveOrReject || canRequestApproval) && (
        <Card className="mt-8 max-w-2xl">
          <CardHeader>
            <h2 className="font-semibold">Ações</h2>
          </CardHeader>

          <CardContent className="space-y-6 w-full">
            {canRequestApproval && stage.status === OsStageStatus.OPEN && (
              <Button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await requestApprovalStage({ osId: id, stageId });
                    toast.success("Aprovação solicitada");
                    router.refresh();
                  } catch {
                    toast.error("Erro ao solicitar aprovação");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full"
                disabled={loading}
              >
                Solicitar Aprovação
              </Button>
            )}

            {canApproveOrReject && (
              <Tabs defaultValue="approve" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="approve">Aprovar</TabsTrigger>
                  <TabsTrigger value="reject">Rejeitar</TabsTrigger>
                </TabsList>

                <TabsContent value="approve">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ao aprovar, a etapa será marcada como concluída.
                    </p>

                    <div className="flex justify-end pt-2 w-full">
                      <Button
                        className="w-full"
                        onClick={async () => {
                          try {
                            setLoading(true);
                            await approveStage({ osId: id, stageId });
                            toast.success("Etapa aprovada");
                            router.refresh();
                          } catch {
                            toast.error("Erro ao aprovar etapa");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={
                          loading ||
                          stage.status !== OsStageStatus.PENDING_APPROVAL
                        }
                      >
                        Aprovar etapa
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reject">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Motivo da rejeição</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Descreva o motivo da rejeição..."
                      />
                    </div>

                    <div className="flex justify-end pt-2 w-full">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={async () => {
                          if (!notes.trim()) {
                            toast.error("Informe o motivo da rejeição");
                            return;
                          }

                          try {
                            setLoading(true);
                            await rejectStage(
                              { osId: id, stageId },
                              { note: notes },
                            );
                            toast.success("Etapa rejeitada");
                            router.refresh();
                          } catch {
                            toast.error("Erro ao rejeitar etapa");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={
                          loading ||
                          stage.status !== OsStageStatus.PENDING_APPROVAL
                        }
                      >
                        Rejeitar etapa
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
