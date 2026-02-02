"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fetchUserProductivity } from "@/src/actions/reports/fetchReports";
import { Skeleton } from "../../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { AlertCircle } from "lucide-react";
import { CustomTooltip } from "./tooltip";

interface UserProductivity {
  userId: string;
  name: string;
  responsibleCount: number;
  participantCount: number;
}

export default function UserProductivityChart() {
  const [data, setData] = useState<UserProductivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProductivity()
      .then((users) => setData(users))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground mb-1">
            Nenhum dado encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Nao ha dados de produtividade disponiveis.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((u) => ({
    name: u.name.split(" ")[0],
    fullName: u.name,
    Responsavel: u.responsibleCount,
    Participante: u.participantCount,
    total: u.responsibleCount + u.participantCount,
  }));

  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.Responsavel, d.Participante)),
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div>
            <CardTitle className="text-lg">
              Produtividade dos Usuarios
            </CardTitle>
            <CardDescription>
              Quantidade de OS por usuario como responsavel e participante
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Responsavel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Participante</span>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                domain={[0, Math.ceil(maxValue * 1.2)]}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="Responsavel"
                fill="#79b6c9"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="Participante"
                fill="#a6dced"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
