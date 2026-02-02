"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Badge, BadgeProps } from "@/src/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  OsStageStatus,
  OsStageStatusLabels,
  RecentStageActivity,
} from "@/src/utils/dashboard/types";

import { RecentActivitiesSkeleton } from "@/src/components/ui/skeleton/recentActivitiesSkeleton";
import { fetchRecentActivities } from "@/src/actions/reports/os-stage/timeline/fetchRecentActivities";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { getAvatarLetters } from "@/src/utils/userContext/getAvatarImage";
import NoResultFallback from "../noResultFallback";
import { Clock } from "lucide-react";
import { Separator } from "@/src/components/ui/separator";
import { getSliceId } from "@/src/utils/ui/getSliceId";

export const OsStageStatusBadgeDict: Record<
  OsStageStatus,
  BadgeProps["variant"]
> = {
  [OsStageStatus.OPEN]: "link",
  [OsStageStatus.PENDING_APPROVAL]: "warning",
  [OsStageStatus.COMPLETED]: "success",
  [OsStageStatus.CANCELLED]: "destructive",
  [OsStageStatus.REJECTED]: "danger",
};

function getMostRecentTime(createdAt: string, updatedAt: string | null) {
  const created = new Date(createdAt);

  if (!updatedAt) {
    return created;
  }

  const updated = new Date(updatedAt);

  return updated > created ? updated : created;
}

export function RecentActivitiesCard() {
  const [activities, setActivities] = useState<RecentStageActivity[] | null>(
    null,
  );

  useEffect(() => {
    fetchRecentActivities()
      .then(setActivities)
      .catch(() => setActivities([]));
  }, []);

  if (!activities) {
    return <RecentActivitiesSkeleton />;
  }

  return (
    <Card className="flex flex-col gap-6 rounded-xl border py-6 w-full">
      <div className="px-6">
        <h2 className="text-base font-semibold">Atividades Recentes</h2>
        <p className="text-sm text-muted-foreground">
          Últimas movimentações de etapas
        </p>
      </div>

      <div className="px-6 space-y-2">
        {activities?.length ? (
          activities.map((activity, index) => (
            <div key={activity.id}>
              <Link
                href={`/dashboard/os/${activity.osId}`}
                className="
            flex w-full items-start gap-3
            rounded-lg p-3
            transition hover:bg-muted/50
          "
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getAvatarLetters(activity.os.responsible?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-tight truncate">
                    <span className="font-medium">
                      {activity.os.responsible?.name}
                    </span>
                  </p>

                  <p className="text-xs text-muted-foreground sm:line-clamp-2">
                    {activity.updatedAt
                      ? activity.createdAt > activity.updatedAt
                        ? "Criou"
                        : "Editou"
                      : "Criou"}{" "}
                    <span className="font-medium">{activity.name}</span> da OS #
                    {getSliceId(activity.osId)}
                  </p>

                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {formatDistanceToNow(
                      getMostRecentTime(activity.createdAt, activity.updatedAt),
                      {
                        addSuffix: true,
                        locale: ptBR,
                      },
                    )}
                  </p>
                </div>

                <Badge
                  variant={OsStageStatusBadgeDict[activity.status]}
                  className="hidden sm:inline-flex shrink-0"
                >
                  {OsStageStatusLabels[activity.status]}
                </Badge>
              </Link>

              {index < activities.length - 1 && <Separator className="my-1" />}
            </div>
          ))
        ) : (
          <NoResultFallback
            text="Nenhuma atividade encontrada"
            subtext="Suas atividades recentes aparecerão aqui"
            icon={Clock}
          />
        )}
      </div>
    </Card>
  );
}
